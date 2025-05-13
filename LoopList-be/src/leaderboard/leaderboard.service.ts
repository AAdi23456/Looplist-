import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User } from '../user/user.entity';
import { Loop } from '../loop/loop.entity';
import { FollowService } from '../user/follow.service';

@Injectable()
export class LeaderboardService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Loop)
    private readonly loopRepo: Repository<Loop>,
    private readonly followService: FollowService,
  ) {}

  async getFriendsLeaderboard(userId: string) {
    // Get mutual follows (friends)
    const friends = await this.followService.getFriends(userId);
    if (!friends.length) return [];
    // Get all loops for each friend
    const friendIds = friends.map(f => f.id);
    const loops = await this.loopRepo.find({
      where: { user: { id: In(friendIds) } },
      relations: ['user'],
    });
    // Aggregate by user
    const leaderboard = friendIds.map(fid => {
      const userLoops = loops.filter(l => l.user.id === fid);
      const bestStreak = Math.max(...userLoops.map(l => l.currentStreak), 0);
      const bestCompletion = Math.max(...userLoops.map(l => l.completionRate), 0);
      return {
        userId: fid,
        displayName: friends.find(f => f.id === fid)?.displayName || '',
        bestStreak,
        bestCompletion,
      };
    });
    // Sort by bestStreak, then bestCompletion
    leaderboard.sort((a, b) => b.bestStreak - a.bestStreak || b.bestCompletion - a.bestCompletion);
    return leaderboard;
  }
} 