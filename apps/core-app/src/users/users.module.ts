import { Module } from '@nestjs/common';
import { UsersController } from './http/users.controller';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '@auth/auth';
import { UsersRepositoryImpl } from './domain/repositories/users.repository.impl';
import { LoginUserUseCase } from './domain/usecases/login-user.usecase';
import { CreateUserUseCase } from './domain/usecases/create-user.usecase';
import { IUsersRepository } from './domain/repositories/users.repository.interface';
import { FindUserUseCase } from './domain/usecases/find-user.usecase.ts';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [UsersController],
  providers: [
    LoginUserUseCase,
    CreateUserUseCase,
    FindUserUseCase,
    {
      provide: IUsersRepository,
      useClass: UsersRepositoryImpl,
    },
  ],
})
export class UsersModule {}
