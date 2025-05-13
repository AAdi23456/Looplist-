import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Loop } from '../loop/loop.entity';
import { User } from '../user/user.entity';

@Injectable()
export class CloneService {
  constructor(
    @InjectRepository(Loop)
    private readonly loopRepo: Repository<Loop>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async cloneLoop(userId: string, loopId: string, custom: Partial<Loop>) {
    const original = await this.loopRepo.findOne({ where: { id: loopId }, relations: ['user'] });
    if (!original) throw new NotFoundException('Original loop not found');
    if (original.visibility !== 'public') throw new ForbiddenException('Loop is not public');
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    const clone = this.loopRepo.create({
      ...original,
      ...custom,
      id: undefined,
      user,
      originalLoopId: original.id,
      originalCreatorId: original.user.id,
      currentStreak: 0,
      longestStreak: 0,
      completionRate: 0,
      createdAt: undefined,
      updatedAt: undefined,
    });
    return this.loopRepo.save(clone);
  }
}
