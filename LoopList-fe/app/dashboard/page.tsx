'use client';

import { useState, useEffect } from 'react';
import LoopCard from '../components/LoopCard';
import dashboardService from '../services/dashboardService';
import loopService, { Loop } from '../services/loopService';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<{
    activeLoops: Loop[];
    brokenLoops: Loop[];
    completedLoops: Loop[];
    streakStats: {
      totalActiveStreaks: number;
      longestCurrentStreak: number;
      averageCompletionRate: number;
    };
    todaysTasks: Loop[];
  } | null>(null);
  
  const [activeTab, setActiveTab] = useState<'active' | 'broken' | 'completed'>('active');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const data = await dashboardService.getDashboardData();
        setDashboardData(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setIsLoading(false);
      }
    }
    
    fetchDashboardData();
  }, []);
  
  const handleCheckLoop = async (loopId: string, completed: boolean) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const updatedLoop = await loopService.updateLoopProgress(loopId, today, completed);
      
      if (dashboardData) {
        // Update the loop in the dashboard data
        const updateLoopInArray = (loops: Loop[]) => 
          loops.map(loop => loop.id === updatedLoop.id ? updatedLoop : loop);
        
        setDashboardData({
          ...dashboardData,
          activeLoops: updateLoopInArray(dashboardData.activeLoops),
          brokenLoops: updateLoopInArray(dashboardData.brokenLoops),
          completedLoops: updateLoopInArray(dashboardData.completedLoops),
          todaysTasks: updateLoopInArray(dashboardData.todaysTasks)
        });
      }
    } catch (error) {
      console.error('Error updating loop progress:', error);
    }
  };
  
  const getTabContent = () => {
    if (!dashboardData) return null;
    
    const loopsToShow = activeTab === 'active' 
      ? dashboardData.activeLoops 
      : activeTab === 'broken' 
        ? dashboardData.brokenLoops 
        : dashboardData.completedLoops;
    
    if (loopsToShow.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No loops found in this category.</p>
        </div>
      );
    }
    
    return (
      <div>
        {loopsToShow.map(loop => (
          <LoopCard 
            key={loop.id}
            loop={loop}
            onCheck={handleCheckLoop}
          />
        ))}
      </div>
    );
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <div className="text-center py-12">
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {dashboardData && (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Streaks</h3>
              <p className="text-2xl font-bold">{dashboardData.streakStats.totalActiveStreaks}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Longest Current Streak</h3>
              <p className="text-2xl font-bold">{dashboardData.streakStats.longestCurrentStreak} days</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Completion</h3>
              <p className="text-2xl font-bold">{Math.round(dashboardData.streakStats.averageCompletionRate * 100)}%</p>
            </div>
          </div>
          
          {/* Today's Tasks */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Today's Tasks</h2>
            {dashboardData.todaysTasks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {dashboardData.todaysTasks.map(loop => (
                  <LoopCard 
                    key={loop.id}
                    loop={loop}
                    onCheck={handleCheckLoop}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-white dark:bg-slate-800 rounded-lg shadow-md">
                <p className="text-gray-500 dark:text-gray-400">No tasks for today!</p>
              </div>
            )}
          </div>
          
          {/* All Loops with Tabs */}
          <div>
            <h2 className="text-xl font-semibold mb-4">All Your Loops</h2>
            <div className="border-b border-gray-200 dark:border-gray-700 mb-4">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab('active')}
                  className={`py-2 px-4 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'active'
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  Active ({dashboardData.activeLoops.length})
                </button>
                <button
                  onClick={() => setActiveTab('broken')}
                  className={`py-2 px-4 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'broken'
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  Broken ({dashboardData.brokenLoops.length})
                </button>
                <button
                  onClick={() => setActiveTab('completed')}
                  className={`py-2 px-4 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'completed'
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  Completed ({dashboardData.completedLoops.length})
                </button>
              </nav>
            </div>
            
            {getTabContent()}
          </div>
        </>
      )}
    </div>
  );
} 