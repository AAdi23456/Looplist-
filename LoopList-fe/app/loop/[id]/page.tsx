'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import loopService, { Loop } from '../../services/loopService';
import StreakHeatmap from '../../components/StreakHeatmap';

export default function LoopDetail() {
  const [loop, setLoop] = useState<Loop | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const params = useParams();
  const router = useRouter();
  const loopId = params.id as string;
  
  useEffect(() => {
    async function fetchLoop() {
      try {
        const data = await loopService.getLoopById(loopId);
        if (data) {
          setLoop(data);
        } else {
          setError('Loop not found');
        }
      } catch (err) {
        setError('Failed to load loop details');
        console.error('Error fetching loop:', err);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchLoop();
  }, [loopId]);
  
  const handleCheckLoop = async (completed: boolean) => {
    if (!loop) return;
    
    try {
      const today = new Date().toISOString().split('T')[0];
      const updatedLoop = await loopService.updateLoopProgress(loop.id, today, completed);
      setLoop(updatedLoop);
    } catch (error) {
      console.error('Error updating loop progress:', error);
    }
  };
  
  const handleClone = () => {
    router.push(`/clone/${loopId}`);
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto p-4 max-w-3xl">
        <div className="text-center py-12">
          <p>Loading loop details...</p>
        </div>
      </div>
    );
  }
  
  if (error || !loop) {
    return (
      <div className="container mx-auto p-4 max-w-3xl">
        <div className="p-4 bg-red-100 text-red-700 rounded-md">
          {error || 'Loop not found'}
        </div>
        <div className="mt-4">
          <Link href="/dashboard" className="text-primary-600 hover:underline">
            &larr; Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }
  
  const today = new Date().toISOString().split('T')[0];
  const isCompletedToday = loop.dailyProgress[today] === true;
  
  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <div className="mb-4">
        <Link href="/dashboard" className="text-primary-600 dark:text-primary-400 hover:underline">
          &larr; Back to Dashboard
        </Link>
      </div>
      
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <span className="text-4xl mr-3">{loop.icon || '🔄'}</span>
            <h1 className="text-2xl font-bold">{loop.title}</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              loop.status === 'active' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                : loop.status === 'broken' 
                  ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
            }`}>
              {loop.status === 'active' 
                ? '🔥 Active' 
                : loop.status === 'broken' 
                  ? '⏸️ Broken' 
                  : '✅ Completed'}
            </span>
            
            <div className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
              {loop.visibility === 'private' 
                ? '🔒 Private' 
                : loop.visibility === 'friends' 
                  ? '👥 Friends Only' 
                  : '🌎 Public'}
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">Frequency:</span> {' '}
            {loop.frequency === 'daily' ? 'Daily' : 
             loop.frequency === 'weekdays' ? 'Weekdays Only' : 
             loop.frequency === '3x_week' ? '3 Times a Week' : 'Custom'}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">Started:</span> {' '}
            {new Date(loop.startDate).toLocaleDateString()}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-center">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Current Streak</h3>
            <p className="text-3xl font-bold">{loop.currentStreak}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">days</p>
          </div>
          
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-center">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Longest Streak</h3>
            <p className="text-3xl font-bold">{loop.longestStreak}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">days</p>
          </div>
          
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-center">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Completion Rate</h3>
            <p className="text-3xl font-bold">{Math.round(loop.completionRate * 100)}%</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">overall</p>
          </div>
        </div>
        
        {/* Check-in for today */}
        <div className="mb-8 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h3 className="text-lg font-medium mb-3">Today's Check-in</h3>
          <div className="flex items-center">
            <button 
              onClick={() => handleCheckLoop(!isCompletedToday)}
              className={`relative h-8 w-8 rounded-full border-2 ${
                isCompletedToday 
                  ? 'border-green-500 bg-green-100 dark:bg-green-900' 
                  : 'border-gray-400'
              } flex items-center justify-center mr-3`}
            >
              {isCompletedToday && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
            <span>
              {isCompletedToday 
                ? 'Completed for today! Great job keeping your streak going.' 
                : loop.status === 'broken' 
                  ? 'Let\'s get back on track. Mark as done when completed.' 
                  : 'Mark as done when you complete this habit today.'}
            </span>
          </div>
        </div>
        
        {/* Streak Heatmap */}
        <StreakHeatmap loop={loop} />
        
        {/* Actions */}
        <div className="flex justify-end space-x-3 mt-6">
          <button 
            onClick={handleClone}
            className="btn-secondary"
          >
            Clone This Loop
          </button>
        </div>
      </div>
    </div>
  );
} 