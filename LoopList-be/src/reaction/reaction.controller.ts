import { Body, Controller, Get, Post, Param, Req, UseGuards } from '@nestjs/common';
import { ReactionService } from './reaction.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

class AddReactionDto {
  loopId: string;
  emoji: string;
}

@UseGuards(JwtAuthGuard)
@Controller('reactions')
export class ReactionController {
  constructor(private readonly reactionService: ReactionService) {}

  @Post()
  async addReaction(@Req() req: Request, @Body() dto: AddReactionDto) {
    const userId = (req.user as any).userId;
    return this.reactionService.addReaction(userId, dto.loopId, dto.emoji);
  }

  @Get(':loopId')
  async getReactions(@Param('loopId') loopId: string) {
    return this.reactionService.getReactionsByLoop(loopId);
  }
}
