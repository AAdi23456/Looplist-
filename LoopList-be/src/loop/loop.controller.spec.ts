import { Test, TestingModule } from '@nestjs/testing';
import { LoopController } from './loop.controller';

describe('LoopController', () => {
  let controller: LoopController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoopController],
    }).compile();

    controller = module.get<LoopController>(LoopController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
