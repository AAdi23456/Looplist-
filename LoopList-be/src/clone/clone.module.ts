import { Module } from '@nestjs/common';
import { CloneService } from './clone.service';
import { CloneController } from './clone.controller';

@Module({
  providers: [CloneService],
  controllers: [CloneController]
})
export class CloneModule {}
