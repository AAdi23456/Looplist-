import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoopService } from './loop.service';
import { LoopController } from './loop.controller';
import { Loop } from './loop.entity';
import { DailyProgress } from './daily-progress.entity';
import { User } from '../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Loop, DailyProgress, User])],
  providers: [LoopService],
  controllers: [LoopController],
  exports: [TypeOrmModule],
})
export class LoopModule {}
