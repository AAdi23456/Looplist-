'use client';

import { useState } from 'react';
import { Loop } from '../services/loopService';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';

interface LoopCardProps {
  loop: Loop;
  isPublic?: boolean;
  onCheck?: (loopId: string, completed: boolean) => void;
  onClone?: (loopId: string) => void;
  onCheer?: (loopId: string) => void;
}

export default function LoopCard({ loop, isPublic = false, onCheck, onClone, onCheer }: LoopCardProps) {
  const [cheered, setCheered] = useState(false);
  
  const getStatusVariant = () => {
    switch (loop.status) {
      case 'active':
        return 'border-l-4 border-l-green-500';
      case 'broken':
        return 'border-l-4 border-l-amber-500';
      case 'completed':
        return 'border-l-4 border-l-blue-500';
      default:
        return '';
    }
  };
  
  const getFrequencyLabel = () => {
    switch (loop.frequency) {
      case 'daily':
        return 'Daily';
      case 'weekdays':
        return 'Weekdays Only';
      case '3x_week':
        return '3 Times a Week';
      default:
        return 'Custom';
    }
  };
  
  const handleCheck = () => {
    if (onCheck) {
      const today = new Date().toISOString().split('T')[0];
      const isCompleted = !loop.dailyProgress[today];
      onCheck(loop.id, isCompleted);
    }
  };
  
  const handleClone = () => {
    if (onClone) {
      onClone(loop.id);
    }
  };
  
  const handleCheer = () => {
    if (onCheer && !cheered) {
      onCheer(loop.id);
      setCheered(true);
    }
  };
  
  const getCompletionBadgeVariant = () => {
    const rate = loop.completionRate;
    if (rate >= 0.8) return 'success';
    if (rate >= 0.5) return 'warning';
    return 'default';
  };
  
  return (
    <Card className={`mb-4 ${getStatusVariant()}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <span className="text-2xl mr-2">{loop.icon || '🔄'}</span>
            <CardTitle>{loop.title}</CardTitle>
          </div>
          {!isPublic && onCheck && (
            <button 
              onClick={handleCheck}
              className="h-6 w-6 rounded-full border-2 border-primary flex items-center justify-center"
            >
              {loop.dailyProgress[new Date().toISOString().split('T')[0]] && (
                <div className="h-4 w-4 bg-primary rounded-full"></div>
              )}
            </button>
          )}
        </div>
        <Badge variant="secondary" className="mt-1">
          {getFrequencyLabel()}
        </Badge>
      </CardHeader>
      
      <CardContent>
        <div className="mt-2">
          <div className="flex justify-between text-sm mb-1">
            <span>Current Streak</span>
            <span className="font-medium">{loop.currentStreak} days</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
            <div 
              className={`h-full ${loop.status === 'active' ? 'bg-primary animate-pulse' : 'bg-slate-400 dark:bg-slate-600'}`}
              style={{ width: `${Math.min(100, loop.currentStreak * 5)}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex justify-between mt-4 text-xs text-slate-600 dark:text-slate-400">
          <div>
            <span>Best: {loop.longestStreak} days</span>
          </div>
          <div>
            <Badge variant={getCompletionBadgeVariant()} className="text-xs">
              {Math.round(loop.completionRate * 100)}% Complete
            </Badge>
          </div>
        </div>
      </CardContent>
      
      {isPublic && (
        <CardFooter className="flex justify-between pt-3 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center">
            <Avatar className="h-6 w-6 mr-2">
              <AvatarFallback>{loop.createdBy.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="text-xs">{loop.createdBy}</span>
            <Badge variant="outline" className="text-xs ml-2">
              {loop.followers} followers
            </Badge>
            <Badge variant="secondary" className="text-xs ml-2">
              Community Success: {Math.round(loop.completionRate * 100)}%
            </Badge>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant={cheered ? "success" : "outline"} 
              size="sm" 
              onClick={handleCheer}
              className="text-xs"
              disabled={cheered}
            >
              👏 Cheer
            </Button>
            <Button 
              variant="primary" 
              size="sm" 
              onClick={handleClone}
              className="text-xs"
            >
              Clone
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
} 