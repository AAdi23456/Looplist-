import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get('friends')
  async getFriendsLeaderboard(@Req() req: Request) {
    const userId = (req.user as any).userId;
    return this.leaderboardService.getFriendsLeaderboard(userId);
  }
} 