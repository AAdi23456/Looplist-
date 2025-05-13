'use client';

import { useMemo } from 'react';
import { Loop } from '../services/loopService';

interface StreakHeatmapProps {
  loop: Loop;
  months?: number;
}

// Helper function to get array of dates from past X months
const getPastMonthDates = (months: number = 3) => {
  const today = new Date();
  const dates: Date[] = [];
  
  // Go back X months
  for (let i = 0; i < months * 31; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.unshift(date); // Add to beginning to keep chronological order
  }
  
  return dates;
};

// Format date as YYYY-MM-DD (to match progress record keys)
const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export default function StreakHeatmap({ loop, months = 3 }: StreakHeatmapProps) {
  const dates = useMemo(() => getPastMonthDates(months), [months]);
  
  // Group dates by week for display
  const weeks = useMemo(() => {
    const result: Date[][] = [];
    let currentWeek: Date[] = [];
    
    dates.forEach((date, index) => {
      currentWeek.push(date);
      
      // Start a new week after 7 days or at the end
      if (currentWeek.length === 7 || index === dates.length - 1) {
        result.push(currentWeek);
        currentWeek = [];
      }
    });
    
    return result;
  }, [dates]);
  
  // Get cell color based on completion status
  const getCellColor = (date: Date) => {
    const dateString = formatDate(date);
    const isToday = dateString === formatDate(new Date());
    const isFuture = date > new Date();
    
    // Future dates are lighter gray
    if (isFuture) {
      return 'bg-gray-100 dark:bg-gray-800';
    }
    
    // Check if we have progress data for this date
    if (dateString in loop.dailyProgress) {
      const isCompleted = loop.dailyProgress[dateString];
      
      // Completed days get green, failed days get red
      return isCompleted 
        ? 'bg-green-500 dark:bg-green-600' 
        : 'bg-red-300 dark:bg-red-900';
    }
    
    // Past days with no data get a light gray
    return isToday 
      ? 'bg-gray-200 dark:bg-gray-700 border border-dashed border-gray-400' 
      : 'bg-gray-200 dark:bg-gray-700';
  };
  
  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium mb-2">Streak Heatmap</h3>
      
      <div className="overflow-x-auto">
        <div className="min-w-max">
          {/* Month labels */}
          <div className="flex mb-1">
            {Array.from({ length: months }).map((_, index) => {
              const date = new Date();
              date.setMonth(date.getMonth() - (months - 1 - index));
              return (
                <div key={index} className="flex-1 text-xs text-gray-600 dark:text-gray-400">
                  {date.toLocaleString('default', { month: 'short' })}
                </div>
              );
            })}
          </div>
          
          {/* Day grid */}
          <div className="flex flex-col gap-1">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex gap-1">
                {week.map((date) => {
                  const dateString = formatDate(date);
                  return (
                    <div 
                      key={dateString}
                      className={`h-4 w-4 rounded-sm ${getCellColor(date)}`}
                      title={`${date.toLocaleDateString()}: ${
                        dateString in loop.dailyProgress 
                          ? loop.dailyProgress[dateString] ? 'Completed' : 'Not Completed'
                          : 'No data'
                      }`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
          
          {/* Legend */}
          <div className="flex items-center gap-4 mt-3">
            <span className="flex items-center gap-1">
              <div className="h-3 w-3 bg-green-500 dark:bg-green-600 rounded-sm"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">Completed</span>
            </span>
            <span className="flex items-center gap-1">
              <div className="h-3 w-3 bg-red-300 dark:bg-red-900 rounded-sm"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">Missed</span>
            </span>
            <span className="flex items-center gap-1">
              <div className="h-3 w-3 bg-gray-200 dark:bg-gray-700 rounded-sm"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">No data</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 