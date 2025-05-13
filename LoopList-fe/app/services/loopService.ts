// Loop types

export interface Loop {
  id: string;
  title: string;
  frequency: 'daily' | 'weekdays' | 'custom' | '3x_week';
  startDate: string;
  visibility: 'private' | 'public' | 'friends';
  icon?: string;
  coverImage?: string;
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
  status: 'active' | 'broken' | 'completed';
  createdBy: string;
  followers: number;
  dailyProgress: Record<string, boolean>;
}

class LoopService {
  async getUserLoops(): Promise<Loop[]> {
    // Call the backend API (to be implemented later)
    // For now, return some dummy/mock data
    return this.getMockLoops();
  }

  async getPublicLoops(): Promise<Loop[]> {
    // Call the backend API (to be implemented later)
    // For now, return some dummy/mock data
    return this.getMockPublicLoops();
  }

  async getTrendingLoops(): Promise<Loop[]> {
    // Call the backend API (to be implemented later)
    // For now, return filtered mock data (most followed)
    const loops = this.getMockPublicLoops();
    return loops.sort((a, b) => b.followers - a.followers).slice(0, 5);
  }

  async getLoopById(id: string): Promise<Loop | null> {
    // Call the backend API (to be implemented later)
    // For now, find in mock data
    const allLoops = [...this.getMockLoops(), ...this.getMockPublicLoops()];
    return allLoops.find(loop => loop.id === id) || null;
  }

  async createLoop(loopData: Omit<Loop, 'id' | 'currentStreak' | 'longestStreak' | 'completionRate' | 'status' | 'followers' | 'dailyProgress'>): Promise<Loop> {
    // Call the backend API (to be implemented later)
    // For now, return a new mock loop
    const newLoop: Loop = {
      id: Math.random().toString(36).substring(2, 9),
      currentStreak: 0,
      longestStreak: 0,
      completionRate: 0,
      status: 'active',
      followers: 0,
      dailyProgress: {},
      ...loopData
    };
    return newLoop;
  }

  async updateLoopProgress(loopId: string, date: string, completed: boolean): Promise<Loop> {
    // Call the backend API (to be implemented later)
    // For now, return updated mock loop
    const loop = await this.getLoopById(loopId);
    if (!loop) throw new Error('Loop not found');
    
    const updatedLoop = { ...loop };
    updatedLoop.dailyProgress = { ...updatedLoop.dailyProgress, [date]: completed };
    
    // Update streak logic would be handled by backend
    // This is simplified for the mock
    if (completed) {
      updatedLoop.currentStreak += 1;
      if (updatedLoop.currentStreak > updatedLoop.longestStreak) {
        updatedLoop.longestStreak = updatedLoop.currentStreak;
      }
      updatedLoop.status = 'active';
    } else {
      updatedLoop.currentStreak = 0;
      updatedLoop.status = 'broken';
    }
    
    return updatedLoop;
  }
  
  // Private methods for mock data
  private getMockLoops(): Loop[] {
    return [
      {
        id: 'loop1',
        title: 'Read 10 pages',
        frequency: 'daily',
        startDate: '2023-05-01',
        visibility: 'private',
        icon: '📚',
        currentStreak: 5,
        longestStreak: 12,
        completionRate: 0.85,
        status: 'active',
        createdBy: 'currentUser',
        followers: 0,
        dailyProgress: {
          '2023-05-01': true,
          '2023-05-02': true,
          '2023-05-03': true,
          '2023-05-04': true,
          '2023-05-05': true
        }
      },
      {
        id: 'loop2',
        title: 'No sugar after 7pm',
        frequency: 'daily',
        startDate: '2023-05-10',
        visibility: 'public',
        icon: '🍭',
        currentStreak: 0,
        longestStreak: 7,
        completionRate: 0.6,
        status: 'broken',
        createdBy: 'currentUser',
        followers: 3,
        dailyProgress: {
          '2023-05-10': true,
          '2023-05-11': true,
          '2023-05-12': true,
          '2023-05-13': false
        }
      },
      {
        id: 'loop3',
        title: 'Meditate for 5 minutes',
        frequency: 'weekdays',
        startDate: '2023-04-15',
        visibility: 'friends',
        icon: '🧘',
        currentStreak: 10,
        longestStreak: 15,
        completionRate: 0.9,
        status: 'active',
        createdBy: 'currentUser',
        followers: 2,
        dailyProgress: {
          '2023-05-01': true,
          '2023-05-02': true,
          '2023-05-03': true,
          '2023-05-04': true,
          '2023-05-05': true
        }
      }
    ];
  }

  private getMockPublicLoops(): Loop[] {
    return [
      {
        id: 'public1',
        title: 'Drink 8 glasses of water',
        frequency: 'daily',
        startDate: '2023-04-01',
        visibility: 'public',
        icon: '💧',
        currentStreak: 35,
        longestStreak: 35,
        completionRate: 0.95,
        status: 'active',
        createdBy: 'user123',
        followers: 120,
        dailyProgress: {}
      },
      {
        id: 'public2',
        title: 'Practice guitar',
        frequency: '3x_week',
        startDate: '2023-03-15',
        visibility: 'public',
        icon: '🎸',
        currentStreak: 7,
        longestStreak: 12,
        completionRate: 0.75,
        status: 'active',
        createdBy: 'musician42',
        followers: 85,
        dailyProgress: {}
      },
      {
        id: 'public3',
        title: 'No social media before noon',
        frequency: 'weekdays',
        startDate: '2023-05-15',
        visibility: 'public',
        icon: '📵',
        currentStreak: 5,
        longestStreak: 5,
        completionRate: 1.0,
        status: 'active',
        createdBy: 'focusguru',
        followers: 230,
        dailyProgress: {}
      },
      {
        id: 'public4',
        title: 'Write 3 things I am grateful for',
        frequency: 'daily',
        startDate: '2023-01-01',
        visibility: 'public',
        icon: '✍️',
        currentStreak: 135,
        longestStreak: 135,
        completionRate: 0.99,
        status: 'active',
        createdBy: 'gratitude_master',
        followers: 352,
        dailyProgress: {}
      }
    ];
  }
}

// Export a singleton instance
const loopService = new LoopService();
export default loopService; 