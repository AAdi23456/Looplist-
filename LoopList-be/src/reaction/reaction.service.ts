import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reaction } from './reaction.entity';
import { Loop } from '../loop/loop.entity';
import { User } from '../user/user.entity';
import { Between } from 'typeorm';

@Injectable()
export class ReactionService {
  constructor(
    @InjectRepository(Reaction)
    private readonly reactionRepo: Repository<Reaction>,
    @InjectRepository(Loop)
    private readonly loopRepo: Repository<Loop>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async addReaction(userId: string, loopId: string, emoji: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const user = await this.userRepo.findOne({ where: { id: userId } });
    const loop = await this.loopRepo.findOne({ where: { id: loopId } });
    if (!user || !loop) throw new ConflictException('User or loop not found');
    const existing = await this.reactionRepo.findOne({
      where: {
        user: { id: userId },
        loop: { id: loopId },
        emoji,
        createdAt: Between(today, tomorrow),
      },
    });
    if (existing) throw new ConflictException('Already reacted today');
    const reaction = this.reactionRepo.create({ user, loop, emoji });
    return this.reactionRepo.save(reaction);
  }

  async getReactionsByLoop(loopId: string) {
    return this.reactionRepo.find({ where: { loop: { id: loopId } }, relations: ['user'] });
  }
}
