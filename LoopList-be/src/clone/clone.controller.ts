import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CloneService } from './clone.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

class CloneLoopDto {
  loopId: string;
  title?: string;
  frequency?: string;
  startDate?: string;
  visibility?: string;
  icon?: string;
}

@UseGuards(JwtAuthGuard)
@Controller('clones')
export class CloneController {
  constructor(private readonly cloneService: CloneService) {}

  @Post()
  async clone(@Req() req: Request, @Body() dto: CloneLoopDto) {
    const userId = (req.user as any).userId;
    const { loopId, ...custom } = dto;
    return this.cloneService.cloneLoop(userId, loopId, custom);
  }
}
