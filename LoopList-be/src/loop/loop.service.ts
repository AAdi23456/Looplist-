import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Loop } from './loop.entity';
import { DailyProgress } from './daily-progress.entity';
import { User } from '../user/user.entity';
import { In, Not } from 'typeorm';

@Injectable()
export class LoopService {
  constructor(
    @InjectRepository(Loop)
    private readonly loopRepo: Repository<Loop>,
    @InjectRepository(DailyProgress)
    private readonly progressRepo: Repository<DailyProgress>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async createLoop(userId: string, data: Partial<Loop>) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    // Validate frequency
    const validFrequencies = ['daily', '3x_week', 'weekdays', 'custom'];
    if (!data.frequency || !validFrequencies.includes(data.frequency)) {
      throw new BadRequestException('Invalid frequency');
    }

    // Validate start date
    if (!data.startDate) {
      throw new BadRequestException('Start date is required');
    }
    const startDate = new Date(data.startDate);
    if (isNaN(startDate.getTime())) {
      throw new BadRequestException('Invalid start date');
    }

    // Validate tags if provided
    if (data.tags) {
      if (!Array.isArray(data.tags)) {
        throw new BadRequestException('Tags must be an array');
      }
      // Clean and validate tags
      data.tags = data.tags
        .map(tag => tag.trim().toLowerCase())
        .filter(tag => tag.length > 0 && tag.length <= 30)
        .slice(0, 10); // Limit to 10 tags
    }

    const loop = this.loopRepo.create({
      ...data,
      user,
      currentStreak: 0,
      longestStreak: 0,
      completionRate: 0,
      status: 'active' as const,
      streakHistory: []
    });
    return this.loopRepo.save(loop);
  }

  async getLoops(userId: string, visibility?: string) {
    const where: any = { user: { id: userId } };
    if (visibility) {
      const validVisibilities = ['public', 'private', 'friends'];
      if (!validVisibilities.includes(visibility)) {
        throw new BadRequestException('Invalid visibility');
      }
      where.visibility = visibility;
    }
    return this.loopRepo.find({ 
      where, 
      relations: ['user'],
      order: { createdAt: 'DESC' }
    });
  }

  async getLoopById(loopId: string, userId: string) {
    const loop = await this.loopRepo.findOne({ 
      where: { id: loopId }, 
      relations: ['user'] 
    });
    
    if (!loop) throw new NotFoundException('Loop not found');
    
    // Allow access if:
    // 1. User owns the loop
    // 2. Loop is public
    if (loop.user.id !== userId && loop.visibility !== 'public') {
      throw new ForbiddenException('Not authorized to view this loop');
    }
    
    return loop;
  }

  async updateLoop(loopId: string, userId: string, data: Partial<Loop>) {
    const loop = await this.getLoopById(loopId, userId);
    
    // Prevent updating certain fields
    const protectedFields = ['user', 'currentStreak', 'longestStreak', 'completionRate'];
    protectedFields.forEach(field => delete data[field]);
    
    // Validate status if provided
    if (data.status && !['active', 'paused', 'completed'].includes(data.status)) {
      throw new BadRequestException('Invalid status');
    }
    
    Object.assign(loop, data);
    return this.loopRepo.save(loop);
  }

  async deleteLoop(loopId: string, userId: string) {
    const loop = await this.getLoopById(loopId, userId);
    await this.loopRepo.remove(loop);
    return { deleted: true };
  }

  async checkIn(loopId: string, userId: string, date: string) {
    const loop = await this.getLoopById(loopId, userId);
    
    // Validate date
    const checkInDate = new Date(date);
    if (isNaN(checkInDate.getTime())) {
      throw new BadRequestException('Invalid date');
    }

    // Check if loop is active
    if (loop.status !== 'active') {
      throw new BadRequestException('Cannot check in to an inactive loop');
    }

    // Check if date is in the future
    if (checkInDate > new Date()) {
      throw new BadRequestException('Cannot check in for future dates');
    }

    let progress = await this.progressRepo.findOne({ 
      where: { 
        loop: { id: loopId }, 
        user: { id: userId }, 
        date 
      } 
    });

    if (!progress) {
      progress = this.progressRepo.create({ 
        loop, 
        user: loop.user, 
        date, 
        completed: true 
      });
    } else {
      progress.completed = true;
    }

    await this.progressRepo.save(progress);
    await this.calculateStreaks(loopId, userId);
    return { checkedIn: true };
  }

  async calculateStreaks(loopId: string, userId: string) {
    const loop = await this.getLoopById(loopId, userId);
    
    // Get all progress for this loop, sorted by date
    const progresses = await this.progressRepo.find({ 
      where: { 
        loop: { id: loopId }, 
        user: { id: userId } 
      }, 
      order: { date: 'ASC' } 
    });

    let currentStreak = 0;
    let longestStreak = 0;
    let streak = 0;
    let lastDate: Date | null = null;
    let completedDays = 0;
    let totalDays = 0;
    let streakHistory = loop.streakHistory || [];

    // Calculate streaks based on frequency
    const startDate = new Date(loop.startDate);
    const today = new Date();
    const daysDiff = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    // Calculate expected days based on frequency
    switch (loop.frequency) {
      case 'daily':
        totalDays = daysDiff + 1;
        break;
      case '3x_week':
        totalDays = Math.floor(daysDiff / 7 * 3);
        break;
      case 'weekdays':
        totalDays = Math.floor(daysDiff / 7 * 5);
        break;
      case 'custom':
        totalDays = progresses.length;
        break;
    }

    // Group progress by week for weekly analysis
    const weeklyProgress = new Map<string, { completed: number; total: number }>();
    progresses.forEach(p => {
      const date = new Date(p.date);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekKey = weekStart.toISOString().split('T')[0];

      if (!weeklyProgress.has(weekKey)) {
        weeklyProgress.set(weekKey, { completed: 0, total: 0 });
      }
      const week = weeklyProgress.get(weekKey)!;
      week.total++;
      if (p.completed) week.completed++;
    });

    // Calculate streaks with more sophisticated rules
    progresses.forEach(p => {
      if (p.completed) completedDays++;
      const thisDate = new Date(p.date);
      
      // Check for streak continuation
      if (p.completed) {
        if (!lastDate || (thisDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24) === 1) {
          streak++;
        } else {
          // Streak broken, but not by too much (allow 1 day grace period)
          const daysSinceLast = (thisDate.getTime() - lastDate!.getTime()) / (1000 * 60 * 60 * 24);
          if (daysSinceLast <= 2) {
            streak = 1; // Start new streak
          } else {
            streak = 0; // Streak completely broken
          }
        }
      } else {
        streak = 0;
      }
      
      if (streak > longestStreak) longestStreak = streak;
      lastDate = thisDate;

      // Record streak history
      streakHistory.push({
        date: p.date,
        streak,
        completionRate: completedDays / totalDays
      });
    });

    currentStreak = streak;
    const completionRate = totalDays ? completedDays / totalDays : 0;

    // Calculate weekly consistency
    let weeklyConsistency = 0;
    weeklyProgress.forEach(week => {
      if (week.total > 0) {
        weeklyConsistency += week.completed / week.total;
      }
    });
    weeklyConsistency = weeklyProgress.size > 0 ? weeklyConsistency / weeklyProgress.size : 0;

    // Update loop with new stats and status
    const status = completionRate >= 0.8 ? 'completed' : 'active';
    await this.loopRepo.update(loopId, { 
      currentStreak, 
      longestStreak, 
      completionRate,
      status,
      streakHistory: streakHistory.slice(-30) // Keep last 30 days of history
    });
  }

  async searchByTags(tags: string[]) {
    if (!tags || !tags.length) return [];
    
    // Clean and validate tags
    const cleanTags = tags
      .map(tag => tag.trim().toLowerCase())
      .filter(tag => tag.length > 0);
    
    if (!cleanTags.length) return [];

    return this.loopRepo.find({
      where: {
        visibility: 'public',
        tags: In(cleanTags)
      },
      relations: ['user', 'reactions'],
      order: {
        currentStreak: 'DESC',
        completionRate: 'DESC'
      }
    });
  }

  async getRelatedLoops(loopId: string) {
    const loop = await this.loopRepo.findOne({ 
      where: { id: loopId },
      relations: ['user']
    });
    
    if (!loop) throw new NotFoundException('Loop not found');
    
    // Find loops with similar tags or category
    return this.loopRepo.find({
      where: [
        { 
          visibility: 'public',
          id: Not(loopId),
          tags: In(loop.tags || [])
        },
        {
          visibility: 'public',
          id: Not(loopId),
          category: loop.category
        }
      ],
      relations: ['user', 'reactions'],
      order: {
        currentStreak: 'DESC',
        completionRate: 'DESC'
      },
      take: 10
    });
  }

  async getFriendsOnlyLoops(friendIds: string[]) {
    if (!friendIds || !friendIds.length) return [];
    return this.loopRepo.find({
      where: {
        visibility: 'friends',
        user: { id: In(friendIds) }
      },
      relations: ['user'],
      order: { createdAt: 'DESC' }
    });
  }
}
