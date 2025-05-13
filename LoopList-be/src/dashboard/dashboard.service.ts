import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Loop } from '../loop/loop.entity';
import { User } from '../user/user.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Loop)
    private readonly loopRepo: Repository<Loop>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async getUserDashboard(userId: string) {
    const loops = await this.loopRepo.find({ where: { user: { id: userId } } });
    return {
      active: loops.filter(l => l.currentStreak > 0),
      paused: loops.filter(l => l.currentStreak === 0 && l.completionRate < 1),
      completed: loops.filter(l => l.completionRate === 1),
    };
  }

  async getUserStats(userId: string) {
    const loops = await this.loopRepo.find({ where: { user: { id: userId } } });
    const total = loops.length;
    const active = loops.filter(l => l.currentStreak > 0).length;
    const completed = loops.filter(l => l.completionRate === 1).length;
    const bestStreak = Math.max(...loops.map(l => l.longestStreak), 0);
    return { total, active, completed, bestStreak };
  }

  async filterUserLoops(userId: string, frequency?: string, tag?: string) {
    const where: any = { user: { id: userId } };
    if (frequency) where.frequency = frequency;
    if (tag) where.category = tag;
    return this.loopRepo.find({ where });
  }
}
