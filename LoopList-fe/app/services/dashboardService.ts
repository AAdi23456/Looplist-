import loopService, { Loop } from './loopService';

export interface DashboardData {
  activeLoops: Loop[];
  brokenLoops: Loop[];
  completedLoops: Loop[];
  streakStats: {
    totalActiveStreaks: number;
    longestCurrentStreak: number;
    averageCompletionRate: number;
  };
  todaysTasks: Loop[];
}

class DashboardService {
  async getDashboardData(): Promise<DashboardData> {
    // Call the backend API (to be implemented later)
    // For now, use loop service to get data and organize it
    
    const userLoops = await loopService.getUserLoops();
    
    const activeLoops = userLoops.filter(loop => loop.status === 'active');
    const brokenLoops = userLoops.filter(loop => loop.status === 'broken');
    const completedLoops = userLoops.filter(loop => loop.status === 'completed');
    
    // Calculate stats
    const totalActiveStreaks = activeLoops.length;
    const longestCurrentStreak = Math.max(...activeLoops.map(loop => loop.currentStreak), 0);
    const completionRates = userLoops.map(loop => loop.completionRate);
    const averageCompletionRate = completionRates.length > 0 
      ? completionRates.reduce((sum, rate) => sum + rate, 0) / completionRates.length
      : 0;
    
    // Get today's tasks (in a real app, this would filter based on today's date)
    const todaysTasks = [...activeLoops, ...brokenLoops]; 
    
    return {
      activeLoops,
      brokenLoops,
      completedLoops,
      streakStats: {
        totalActiveStreaks,
        longestCurrentStreak,
        averageCompletionRate
      },
      todaysTasks
    };
  }
}

// Export a singleton instance
const dashboardService = new DashboardService();
export default dashboardService; 