import { Test, TestingModule } from '@nestjs/testing';
import { LoginUserUseCase } from '../domain/usecases/login-user.usecase';
import { CreateUserUseCase } from '../domain/usecases/create-user.usecase';
import { UsersController } from './users.controller';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [LoginUserUseCase, CreateUserUseCase],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
