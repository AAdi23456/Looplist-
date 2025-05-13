'use client';

import { useState, FormEvent } from 'react';
import { Loop } from '../services/loopService';

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
  const [startDate, setStartDate] = useState(initialValues?.startDate || new Date().toISOString().split('T')[0]);
  const [visibility, setVisibility] = useState<'private' | 'public' | 'friends'>(initialValues?.visibility || 'private');
  const [icon, setIcon] = useState(initialValues?.icon || EMOJI_OPTIONS[0]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
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
  
  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-1">
          {isCloning ? 'Clone this Loop' : 'Create a New Loop'}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {isCloning 
            ? 'Make any adjustments you like before adding to your loops.' 
            : 'Add a new recurring micro-habit to track.'}
        </p>
      </div>
      
      <div className="mb-4">
        <label htmlFor="icon" className="block text-sm font-medium mb-1">
          Icon
        </label>
        <div className="flex flex-wrap items-center">
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="h-10 w-10 flex items-center justify-center text-2xl border border-gray-300 dark:border-gray-600 rounded-md mr-3"
          >
            {icon}
          </button>
          
          {showEmojiPicker && (
            <div className="flex flex-wrap mt-2 gap-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-md">
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => {
                    setIcon(emoji);
                    setShowEmojiPicker(false);
                  }}
                  className="h-8 w-8 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Loop Title *
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Read 10 pages, No sugar after 7pm"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-slate-800"
          required
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="frequency" className="block text-sm font-medium mb-1">
          Frequency *
        </label>
        <select
          id="frequency"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value as any)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-slate-800"
          required
        >
          <option value="daily">Daily</option>
          <option value="weekdays">Weekdays Only</option>
          <option value="3x_week">3 Times a Week</option>
          <option value="custom">Custom</option>
        </select>
      </div>
      
      <div className="mb-4">
        <label htmlFor="startDate" className="block text-sm font-medium mb-1">
          Start Date *
        </label>
        <input
          id="startDate"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-slate-800"
          required
        />
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Visibility *
        </label>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setVisibility('private')}
            className={`px-4 py-2 rounded-full text-sm ${
              visibility === 'private'
              ? 'bg-primary-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
          >
            🔒 Private
          </button>
          <button
            type="button"
            onClick={() => setVisibility('friends')}
            className={`px-4 py-2 rounded-full text-sm ${
              visibility === 'friends'
              ? 'bg-primary-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
          >
            👥 Friends Only
          </button>
          <button
            type="button"
            onClick={() => setVisibility('public')}
            className={`px-4 py-2 rounded-full text-sm ${
              visibility === 'public'
              ? 'bg-primary-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
          >
            🌎 Public
          </button>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          className="btn-primary"
          disabled={!title || !startDate}
        >
          {isCloning ? 'Clone Loop' : 'Create Loop'}
        </button>
      </div>
      
      {isCloning && initialValues?.createdBy && (
        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
          Inspired by {initialValues.createdBy}
        </div>
      )}
    </form>
  );
} 