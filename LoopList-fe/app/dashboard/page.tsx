'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import LoopCard from '../components/LoopCard';
import dashboardService from '../services/dashboardService';
import loopService, { Loop } from '../services/loopService';
import { getFriends, getFollowers, getFollowing, followUser, unfollowUser } from '../services/followService';
import { getFriendsLeaderboard } from '../services/leaderboardService';
import { getMissedCheckins } from '../services/nudgeService';

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
  
  const [activeTab, setActiveTab] = useState<'active' | 'broken' | 'completed' | 'friends' | 'leaderboard' | 'friendsloops'>('active');
  const [isLoading, setIsLoading] = useState(true);

  // Friends tab state
  const [friends, setFriends] = useState<any[]>([]);
  const [followers, setFollowers] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);
  const [friendsLoading, setFriendsLoading] = useState(false);
  const [friendsError, setFriendsError] = useState<string | null>(null);
  const [buttonLoading, setButtonLoading] = useState<string | null>(null);
  const currentUser = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

  // Leaderboard tab state
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);
  const [leaderboardError, setLeaderboardError] = useState<string | null>(null);

  const [missedLoops, setMissedLoops] = useState<Loop[]>([]);
  const [nudgeLoading, setNudgeLoading] = useState(false);

  const [friendsLoops, setFriendsLoops] = useState<Loop[]>([]);
  const [friendsLoopsLoading, setFriendsLoopsLoading] = useState(false);
  const [friendsLoopsError, setFriendsLoopsError] = useState<string | null>(null);

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

  useEffect(() => {
    if (activeTab !== 'friends') return;
    setFriendsLoading(true);
    setFriendsError(null);
    Promise.all([getFriends(), getFollowers(), getFollowing()])
      .then(([friends, followers, following]) => {
        setFriends(friends);
        setFollowers(followers);
        setFollowing(following);
        setFriendsLoading(false);
      })
      .catch(() => {
        setFriendsError('Failed to load friends data');
        setFriendsLoading(false);
      });
  }, [activeTab]);

  useEffect(() => {
    if (activeTab !== 'leaderboard') return;
    setLeaderboardLoading(true);
    setLeaderboardError(null);
    getFriendsLeaderboard()
      .then(setLeaderboard)
      .catch(() => setLeaderboardError('Failed to load leaderboard'))
      .finally(() => setLeaderboardLoading(false));
  }, [activeTab]);

  useEffect(() => {
    setNudgeLoading(true);
    getMissedCheckins()
      .then(setMissedLoops)
      .catch(() => setMissedLoops([]))
      .finally(() => setNudgeLoading(false));
  }, []);

  useEffect(() => {
    if (activeTab !== 'friendsloops') return;
    setFriendsLoopsLoading(true);
    setFriendsLoopsError(null);
    loopService.getFriendsOnlyLoops()
      .then(setFriendsLoops)
      .catch(() => setFriendsLoopsError('Failed to load friends-only loops'))
      .finally(() => setFriendsLoopsLoading(false));
  }, [activeTab]);

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

  const handleFollow = async (userId: string) => {
    setButtonLoading(userId);
    await followUser(userId);
    setFollowing(f => [...f, { id: userId }]);
    setButtonLoading(null);
    setFriendsError(null);
  };
  const handleUnfollow = async (userId: string) => {
    setButtonLoading(userId);
    await unfollowUser(userId);
    setFollowing(f => f.filter(u => u.id !== userId));
    setButtonLoading(null);
    setFriendsError(null);
  };

  const renderUserList = (users: any[], type: 'friends' | 'followers' | 'following') => {
    if (!users.length) {
      return <div className="text-center py-4 text-gray-500 dark:text-gray-400">No users found.</div>;
    }
    return (
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {users.map(user => {
          const isYou = user.id === currentUser;
          return (
            <li
              key={user.id}
              className="flex items-center justify-between py-3 group hover:bg-primary-50 dark:hover:bg-slate-700 rounded transition-colors"
              tabIndex={0}
              aria-label={`User ${user.displayName || user.email || user.id}`}
            >
              <Link href={`/profile/${user.id}`} className="flex items-center focus:outline-none focus:ring-2 focus:ring-primary-400 rounded">
                <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center mr-3 text-primary-700 font-bold border border-primary-200 group-hover:border-primary-400">
                  {user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || '?'}
                </div>
                <span className="font-medium text-gray-800 dark:text-gray-100 group-hover:underline">
                  {user.displayName || user.email || user.id}
                </span>
                {isYou && <span className="ml-2 text-xs text-primary-500 font-semibold">(You)</span>}
                {type === 'friends' && !isYou && <span className="ml-2 text-xs text-green-600">Mutual</span>}
              </Link>
              {!isYou && type !== 'friends' && (
                following.some(u => u.id === user.id) ? (
                  <button
                    className="px-3 py-1 rounded text-xs font-medium border bg-green-100 text-green-700 border-green-400 ml-2 min-w-[80px]"
                    onClick={() => handleUnfollow(user.id)}
                    disabled={buttonLoading === user.id}
                  >
                    {buttonLoading === user.id ? '...' : 'Unfollow'}
                  </button>
                ) : (
                  <button
                    className="px-3 py-1 rounded text-xs font-medium border bg-blue-100 text-blue-700 border-blue-400 ml-2 min-w-[80px]"
                    onClick={() => handleFollow(user.id)}
                    disabled={buttonLoading === user.id}
                  >
                    {buttonLoading === user.id ? '...' : 'Follow'}
                  </button>
                )
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  const renderLeaderboard = () => {
    if (leaderboardLoading) {
      return <div className="text-center py-8">Loading leaderboard...</div>;
    }
    if (leaderboardError) {
      return <div className="text-center py-8 text-red-500">{leaderboardError}</div>;
    }
    if (!leaderboard.length) {
      return <div className="text-center py-8 text-gray-500 dark:text-gray-400">No friends leaderboard data yet.</div>;
    }
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">#</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">User</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">Best Streak</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">Best Completion</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, idx) => (
              <tr key={entry.userId} className="hover:bg-primary-50 dark:hover:bg-slate-700 transition-colors">
                <td className="px-4 py-2 font-mono text-xs text-gray-500">{idx + 1}</td>
                <td className="px-4 py-2">
                  <Link href={`/profile/${entry.userId}`} className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center mr-2 text-primary-700 font-bold border border-primary-200">
                      {entry.displayName?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <span className="font-medium text-gray-800 dark:text-gray-100 group-hover:underline">
                      {entry.displayName || entry.userId}
                    </span>
                    {entry.userId === currentUser && <span className="ml-2 text-xs text-primary-500 font-semibold">(You)</span>}
                  </Link>
                </td>
                <td className="px-4 py-2 text-center font-semibold text-green-700 dark:text-green-400">{entry.bestStreak}</td>
                <td className="px-4 py-2 text-center font-semibold text-blue-700 dark:text-blue-400">{Math.round(entry.bestCompletion * 100)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const getTabContent = () => {
    if (activeTab === 'friends') {
      return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Your Social Circle</h2>
          {friendsLoading ? (
            <div className="text-center py-8">Loading friends...</div>
          ) : friendsError ? (
            <div className="text-center py-8 text-red-500">{friendsError}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-semibold mb-2 border-b pb-1 mb-3">Friends</h3>
                {renderUserList(friends, 'friends')}
              </div>
              <div>
                <h3 className="font-semibold mb-2 border-b pb-1 mb-3">Followers</h3>
                {renderUserList(followers, 'followers')}
              </div>
              <div>
                <h3 className="font-semibold mb-2 border-b pb-1 mb-3">Following</h3>
                {renderUserList(following, 'following')}
              </div>
            </div>
          )}
        </div>
      );
    }
    if (activeTab === 'leaderboard') {
      return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Friends Leaderboard</h2>
          {renderLeaderboard()}
        </div>
      );
    }
    if (activeTab === 'friendsloops') {
      return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Friends' Loops</h2>
          {friendsLoopsLoading ? (
            <div className="text-center py-8">Loading friends' loops...</div>
          ) : friendsLoopsError ? (
            <div className="text-center py-8 text-red-500">{friendsLoopsError}</div>
          ) : !friendsLoops.length ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">No friends-only loops to show.</div>
          ) : (
            <div>
              {friendsLoops.map(loop => (
                <LoopCard key={loop.id} loop={loop} isPublic={true} />
              ))}
            </div>
          )}
        </div>
      );
    }
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
      {/* Gentle Nudge for Missed Check-ins */}
      {nudgeLoading ? null : missedLoops.length > 0 && (
        <div className="mb-6 bg-yellow-50 dark:bg-yellow-900 border-l-4 border-yellow-400 p-4 rounded-lg flex items-center">
          <span className="text-2xl mr-3">💡</span>
          <div>
            <div className="font-semibold text-yellow-800 dark:text-yellow-200 mb-1">Let's get back on track!</div>
            <div className="text-sm text-yellow-700 dark:text-yellow-100">
              You missed check-ins for {missedLoops.length} loop{missedLoops.length > 1 ? 's' : ''} today:
              <ul className="list-disc ml-6 mt-1">
                {missedLoops.slice(0, 3).map(loop => (
                  <li key={loop.id}>
                    <Link href={`/loop/${loop.id}`} className="text-primary-600 hover:underline">
                      {loop.title}
                    </Link>
                  </li>
                ))}
              </ul>
              {missedLoops.length > 3 && <span className="ml-2">and more...</span>}
            </div>
          </div>
        </div>
      )}
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
                <button
                  onClick={() => setActiveTab('friends')}
                  className={`py-2 px-4 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'friends'
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  Friends
                </button>
                <button
                  onClick={() => setActiveTab('leaderboard')}
                  className={`py-2 px-4 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'leaderboard'
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  Leaderboard
                </button>
                <button
                  onClick={() => setActiveTab('friendsloops')}
                  className={`py-2 px-4 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'friendsloops'
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  Friends' Loops
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