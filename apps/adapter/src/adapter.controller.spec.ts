import { Test, TestingModule } from '@nestjs/testing';
import { AdapterController } from './adapter.controller';
import { AdapterService } from './adapter.service';

describe('AdapterController', () => {
  let adapterController: AdapterController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AdapterController],
      providers: [AdapterService],
    }).compile();

    adapterController = app.get<AdapterController>(AdapterController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(adapterController.getHello()).toBe('Hello World!');
    });
  });
});
