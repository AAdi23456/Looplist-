import { api } from './api';

export interface User {
  id: string;
  displayName?: string;
  email?: string;
}

class FollowService {
  async followUser(userId: string): Promise<void> {
    await api.post(`/follow/${userId}`);
  }

  async unfollowUser(userId: string): Promise<void> {
    await api.delete(`/follow/${userId}`);
  }

  async getFriends(): Promise<User[]> {
    return api.get('/follow/friends');
  }

  async getFollowers(): Promise<User[]> {
    return api.get('/follow/followers');
  }

  async getFollowing(): Promise<User[]> {
    return api.get('/follow/following');
  }
}

const followService = new FollowService();
export default followService;

// Export individual functions for backward compatibility
export const { followUser, unfollowUser, getFriends, getFollowers, getFollowing } = followService; 