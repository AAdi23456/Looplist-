import { Controller, Post, Delete, Get, Param, Req, UseGuards } from '@nestjs/common';
import { FollowService } from './follow.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post(':userId')
  async follow(@Req() req: Request, @Param('userId') userId: string) {
    const myId = (req.user as any).userId;
    return this.followService.follow(myId, userId);
  }

  @Delete(':userId')
  async unfollow(@Req() req: Request, @Param('userId') userId: string) {
    const myId = (req.user as any).userId;
    return this.followService.unfollow(myId, userId);
  }

  @Get('friends')
  async getFriends(@Req() req: Request) {
    const myId = (req.user as any).userId;
    return this.followService.getFriends(myId);
  }

  @Get('followers')
  async getFollowers(@Req() req: Request) {
    const myId = (req.user as any).userId;
    return this.followService.getFollowers(myId);
  }

  @Get('following')
  async getFollowing(@Req() req: Request) {
    const myId = (req.user as any).userId;
    return this.followService.getFollowing(myId);
  }
} 