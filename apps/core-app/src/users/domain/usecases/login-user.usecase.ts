import { IAuthService, Role } from '@auth/auth';
import { Injectable } from '@nestjs/common';
import { LoginUserRequestDto } from '../../http/dto/request/login-user-request.dto';
import { LoginUserResponseDto } from '../../http/dto/response/login-user-response.dto';
import { IUsersRepository } from '../repositories/users.repository.interface';
import { BusinessException } from 'exceptions/exceptions';

@Injectable()
export class LoginUserUseCase {
  constructor(
    private readonly usersRepository: IUsersRepository,
    private readonly authService: IAuthService,
  ) {}

  async execute(loginDto: LoginUserRequestDto): Promise<LoginUserResponseDto> {
    const user = await this.usersRepository.findUserByEmail(loginDto.email);

    if (!user) {
      throw new BusinessException('Usuário não encontrado');
    }

    const isValid = await this.authService.validatePassword(
      loginDto.password,
      user.passwordHash,
    );

    if (!isValid) {
      throw new BusinessException('Senha inválida', 401);
    }

    return this.authService.login({
      userId: user.id,
      email: user.email,
      role: Role.User,
    });
  }
}
