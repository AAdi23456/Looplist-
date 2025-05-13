import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Loop } from '../loop/loop.entity';
import { DailyProgress } from '../loop/daily-progress.entity';
import { User } from '../user/user.entity';

@Injectable()
export class NudgeService {
  constructor(
    @InjectRepository(Loop)
    private readonly loopRepo: Repository<Loop>,
    @InjectRepository(DailyProgress)
    private readonly progressRepo: Repository<DailyProgress>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async getMissedCheckins(userId: string, date?: string) {
    const today = date || new Date().toISOString().slice(0, 10);
    // Get all active loops for the user
    const loops = await this.loopRepo.find({ where: { user: { id: userId }, status: 'active' } });
    if (!loops.length) return [];
    // Get all progress for today
    const progresses = await this.progressRepo.find({
      where: { user: { id: userId }, date: today },
      relations: ['loop'],
    });
    const checkedInLoopIds = progresses.filter(p => p.completed).map(p => p.loop.id);
    // Return loops where no check-in for today
    return loops.filter(loop => !checkedInLoopIds.includes(loop.id));
  }
} 