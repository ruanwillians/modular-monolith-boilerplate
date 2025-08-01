import { Injectable } from '@nestjs/common';

import { IUsersRepository } from '../repositories/users.repository.interface';
import { BusinessException } from 'exceptions/exceptions';
import { FindUserResponseDto } from '../../http/dto/response/find-user-response.dto';

@Injectable()
export class FindUserUseCase {
  constructor(private readonly usersRepository: IUsersRepository) {}

  async execute(id: string): Promise<FindUserResponseDto> {
    const existingUser = await this.usersRepository.findUserById(id);

    if (!existingUser) {
      throw new BusinessException('Usuário não encontrado', 404);
    }

    return {
      id: String(existingUser.id),
      email: existingUser.email,
    };
  }
}
