import { Controller, Get, Put, Body, Req, UseGuards, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { UserService } from './user.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  @Get('profile')
  async getProfile(@Req() req: Request) {
    const userId = (req.user as any).userId;
    return this.userService.getProfile(userId);
  }

  @Put('profile')
  async updateProfile(@Req() req: Request, @Body() dto: UpdateProfileDto) {
    const userId = (req.user as any).userId;
    return this.userService.updateProfile(userId, dto);
  }

  @Get(':id')
  async getUserProfile(@Param('id') id: string) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) return { error: 'User not found' };
    // Only return public fields
    return {
      id: user.id,
      displayName: user.displayName,
      email: user.email,
      createdAt: user.createdAt,
    };
  }
}
