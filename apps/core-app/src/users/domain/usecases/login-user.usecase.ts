import { IAuthService, Role } from '@auth/auth';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginUserRequestDto } from '../../http/dto/request/login-user-request.dto';
import { LoginUserResponseDto } from '../../http/dto/response/login-user-response.dto';
import { UserEntity } from '../entities/user.entity';
import { IUsersRepository } from '../repositories/users.repository.interface';
import { BusinessException } from 'exceptions/exceptions';

@Injectable()
export class LoginUserUseCase {
  constructor(
    private readonly usersRepository: IUsersRepository,
    private readonly authService: IAuthService,
  ) {}

  async execute(loginDto: LoginUserRequestDto): Promise<LoginUserResponseDto> {
    const userRecord = await this.usersRepository.findByEmail(loginDto.email);

    if (!userRecord) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    const user = new UserEntity(
      userRecord.id,
      userRecord.email,
      userRecord.passwordHash,
    );

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
