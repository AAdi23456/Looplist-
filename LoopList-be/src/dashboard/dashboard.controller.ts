import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  async dashboard(@Req() req: Request) {
    const userId = (req.user as any).userId;
    return this.dashboardService.getUserDashboard(userId);
  }

  @Get('stats')
  async stats(@Req() req: Request) {
    const userId = (req.user as any).userId;
    return this.dashboardService.getUserStats(userId);
  }

  @Get('filter')
  async filter(@Req() req: Request, @Query('frequency') frequency?: string, @Query('tag') tag?: string) {
    const userId = (req.user as any).userId;
    return this.dashboardService.filterUserLoops(userId, frequency, tag);
  }
}
