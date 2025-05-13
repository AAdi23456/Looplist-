'use client';

import { useState, FormEvent } from 'react';
import { Loop } from '../services/loopService';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Calendar } from './ui/calendar';
import { format } from 'date-fns';

interface LoopFormProps {
  onSubmit: (loopData: Omit<Loop, 'id' | 'currentStreak' | 'longestStreak' | 'completionRate' | 'status' | 'followers' | 'dailyProgress'>) => void;
  initialValues?: Partial<Loop>;
  isCloning?: boolean;
}

const EMOJI_OPTIONS = [
  '📚', '🍎', '💪', '🧘', '🏃', '💧', '🚶', '🎯', '🧠', '🏋️',
  '🎸', '🎨', '✍️', '💻', '📝', '🛌', '⏰', '🧹', '🚫', '🍭'
];

export default function LoopForm({ onSubmit, initialValues, isCloning = false }: LoopFormProps) {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [frequency, setFrequency] = useState<'daily' | 'weekdays' | 'custom' | '3x_week'>(initialValues?.frequency || 'daily');
  const [startDate, setStartDate] = useState<string>(initialValues?.startDate || new Date().toISOString().split('T')[0]);
  const [visibility, setVisibility] = useState<'private' | 'public' | 'friends'>(initialValues?.visibility || 'private');
  const [icon, setIcon] = useState(initialValues?.icon || EMOJI_OPTIONS[0]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(
    initialValues?.startDate ? new Date(initialValues.startDate) : new Date()
  );
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    const loopData = {
      title,
      frequency,
      startDate,
      visibility,
      icon,
      createdBy: 'currentUser', // In a real app, this would come from auth context
    };
    
    onSubmit(loopData);
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setCalendarDate(date);
      setStartDate(format(date, 'yyyy-MM-dd'));
    }
  };
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {isCloning ? 'Clone this Loop' : 'Create a New Loop'}
        </CardTitle>
        <CardDescription>
          {isCloning 
            ? 'Make any adjustments you like before adding to your loops.' 
            : 'Add a new recurring micro-habit to track.'}
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="icon" className="block text-sm font-medium mb-1">
              Icon
            </label>
            <div className="flex flex-wrap items-center">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="h-10 w-10 flex items-center justify-center text-2xl p-0 mr-3"
              >
                {icon}
              </Button>
              
              {showEmojiPicker && (
                <div className="flex flex-wrap mt-2 gap-2 p-2 bg-slate-100 dark:bg-slate-800 rounded-md">
                  {EMOJI_OPTIONS.map((emoji) => (
                    <Button
                      key={emoji}
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setIcon(emoji);
                        setShowEmojiPicker(false);
                      }}
                      className="h-8 w-8 flex items-center justify-center p-0"
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Loop Title *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Read 10 pages, No sugar after 7pm"
              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-950"
              required
            />
          </div>
          
          <div>
            <label htmlFor="frequency" className="block text-sm font-medium mb-1">
              Frequency *
            </label>
            <select
              id="frequency"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as any)}
              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-950"
              required
            >
              <option value="daily">Daily</option>
              <option value="weekdays">Weekdays Only</option>
              <option value="3x_week">3 Times a Week</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Start Date *
            </label>
            <div className="border border-slate-200 dark:border-slate-700 rounded-md p-3">
              <Calendar
                mode="single"
                selected={calendarDate}
                onSelect={handleDateChange}
                initialFocus
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Visibility *
            </label>
            <div className="flex flex-wrap gap-3">
              <Button
                type="button"
                variant={visibility === 'private' ? 'default' : 'outline'}
                onClick={() => setVisibility('private')}
                className="flex items-center"
              >
                🔒 Private
              </Button>
              <Button
                type="button"
                variant={visibility === 'friends' ? 'default' : 'outline'}
                onClick={() => setVisibility('friends')}
                className="flex items-center"
              >
                👥 Friends Only
              </Button>
              <Button
                type="button"
                variant={visibility === 'public' ? 'default' : 'outline'}
                onClick={() => setVisibility('public')}
                className="flex items-center"
              >
                🌎 Public
              </Button>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          {isCloning && initialValues?.createdBy && (
            <Badge variant="outline" className="text-xs">
              Inspired by {initialValues.createdBy}
            </Badge>
          )}
          <Button
            type="submit"
            disabled={!title || !startDate}
          >
            {isCloning ? 'Clone Loop' : 'Create Loop'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
} 