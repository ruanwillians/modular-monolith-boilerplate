import { Injectable } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { randomUUID } from 'crypto';
import { CreateUserResponseDto } from '../../http/dto/response/create-user-response.dto';
import { IAuthService } from '@auth/auth';
import { IUsersRepository } from '../repositories/users.repository.interface';
import { BusinessException } from 'exceptions/exceptions';
import { CreateUserRequestDto } from '../../http/dto/request/create-user-request.dto';

@Injectable()
export class CreateUserUseCase {
  constructor(
    private readonly usersRepository: IUsersRepository,
    private readonly authService: IAuthService,
  ) {}

  async execute({
    email,
    password,
  }: CreateUserRequestDto): Promise<CreateUserResponseDto> {
    const existingUser = await this.usersRepository.findUserByEmail(email);

    if (existingUser) {
      throw new BusinessException('Usuário já cadastrado', 409);
    }

    const passwordHash = await this.authService.hashPassword(password);

    const userEntity = new UserEntity(randomUUID(), email, passwordHash);

    const createdUser = await this.usersRepository.createUser(userEntity);

    return {
      id: createdUser.id,
      email: createdUser.email,
    };
  }
}
