import { IAuthService, IUserFromJwt } from '@auth/auth';
import { Injectable } from '@nestjs/common';
import { LoginUserResponseDto } from '../../http/dto/response/login-user-response.dto';
import { IUsersRepository } from '../repositories/users.repository.interface';
import { BusinessException } from 'exceptions/exceptions';
import { RefreshTokenUserRequestDto } from '../../http/dto/request/refresh-token-user-request.dto';

@Injectable()
export class RefreshTokenUSerUseCase {
  constructor(
    private readonly usersRepository: IUsersRepository,
    private readonly authService: IAuthService,
  ) {}

  async execute(
    refreshTokenDto: RefreshTokenUserRequestDto,
  ): Promise<LoginUserResponseDto> {
    const decodedToken: IUserFromJwt = this.authService.decodeRefreshToken(
      refreshTokenDto.refreshToken,
    );

    const user = await this.usersRepository.findUserById(decodedToken.sub);

    if (!user) {
      throw new BusinessException('Usuário não encontrado');
    }

    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }
}
