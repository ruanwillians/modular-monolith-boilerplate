import { Injectable } from '@nestjs/common';

import { IAuthService } from '@auth/auth';
import { IUsersRepository } from '../repositories/users.repository.interface';
import { BusinessException } from 'exceptions/exceptions';
import { FindUserResponseDto } from '../../http/dto/response/find-user-response.dto';

@Injectable()
export class FindUserUseCase {
  constructor(
    private readonly usersRepository: IUsersRepository,
    private readonly authService: IAuthService,
  ) {}

  async execute(id: string): Promise<FindUserResponseDto> {
    const existingUser = await this.usersRepository.findById(id);

    if (!existingUser) {
      throw new BusinessException('Usuário não encontrado', 404);
    }

    return {
      id: existingUser.id,
      email: existingUser.email,
    };
  }
}
