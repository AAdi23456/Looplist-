import { Test, TestingModule } from '@nestjs/testing';
import { CloneController } from './clone.controller';

describe('CloneController', () => {
  let controller: CloneController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CloneController],
    }).compile();

    controller = module.get<CloneController>(CloneController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
