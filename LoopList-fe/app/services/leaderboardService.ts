import { api } from './api';

export interface LeaderboardEntry {
  userId: string;
  displayName?: string;
  bestStreak: number;
  bestCompletion: number;
}

class LeaderboardService {
  async getFriendsLeaderboard(): Promise<LeaderboardEntry[]> {
    return api.get('/leaderboard/friends');
  }
}

const leaderboardService = new LeaderboardService();
export default leaderboardService;

// Export individual functions for backward compatibility
export const { getFriendsLeaderboard } = leaderboardService; 