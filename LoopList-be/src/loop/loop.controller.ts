import { Body, Controller, Get, Post, Put, Delete, Param, Query, UseGuards, Req } from '@nestjs/common';
import { LoopService } from './loop.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

class CreateLoopDto {
  title: string;
  frequency: string;
  startDate: string;
  visibility?: string;
  icon?: string;
}

class UpdateLoopDto {
  title?: string;
  frequency?: string;
  startDate?: string;
  visibility?: string;
  icon?: string;
}

@UseGuards(JwtAuthGuard)
@Controller('loops')
export class LoopController {
  constructor(private readonly loopService: LoopService) {}

  @Post()
  async create(@Req() req: Request, @Body() dto: CreateLoopDto) {
    const userId = (req.user as any).userId;
    return this.loopService.createLoop(userId, { ...dto, startDate: dto.startDate });
  }

  @Get()
  async findAll(@Req() req: Request, @Query('visibility') visibility?: string) {
    const userId = (req.user as any).userId;
    return this.loopService.getLoops(userId, visibility);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: Request) {
    const userId = (req.user as any).userId;
    return this.loopService.getLoopById(id, userId);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Req() req: Request, @Body() dto: UpdateLoopDto) {
    const userId = (req.user as any).userId;
    const updateData = { ...dto };
    if (dto.startDate) updateData.startDate = dto.startDate;
    return this.loopService.updateLoop(id, userId, updateData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: Request) {
    const userId = (req.user as any).userId;
    return this.loopService.deleteLoop(id, userId);
  }

  @Post(':id/checkin')
  async checkIn(@Param('id') id: string, @Req() req: Request, @Body('date') date: string) {
    const userId = (req.user as any).userId;
    return this.loopService.checkIn(id, userId, date);
  }
}
