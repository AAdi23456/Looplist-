import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { NudgeService } from './nudge.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('nudge')
export class NudgeController {
  constructor(private readonly nudgeService: NudgeService) {}

  @Get('missed-checkins')
  async getMissedCheckins(@Req() req: Request, @Query('date') date?: string) {
    const userId = (req.user as any).userId;
    return this.nudgeService.getMissedCheckins(userId, date);
  }
} 