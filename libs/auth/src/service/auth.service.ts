import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { IUserFromJwt } from '../interfaces/user-from-jwt.interface';
import { IAuthService } from './auth.service.interface';
import { ILoginResponse } from '../interfaces/login-response.interface';
import { BusinessException } from 'exceptions/exceptions';

@Injectable()
export class AuthService implements IAuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private jwtService: JwtService) {}

  refreshToken(refreshToken: string): ILoginResponse {
    const payload: IUserFromJwt = this.jwtService.verify(refreshToken, {
      secret: process.env.JWT_REFRESH_SECRET,
    });

    return this.login({
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
    });
  }

  login(user: IUserFromJwt): ILoginResponse {
    const payload = {
      sub: user.sub,
      email: user.email,
      role: user.role,
    };

    return {
      accessToken: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '2h',
      }),
      refreshToken: this.jwtService.sign(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '3d',
      }),
    };
  }

  async validatePassword(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }

  async hashPassword(plain: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(plain, saltRounds);
  }

  decodeRefreshToken(token: string): IUserFromJwt {
    try {
      return this.jwtService.verify<IUserFromJwt>(token, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch (err) {
      this.logger.error(err);
      throw new BusinessException('Refresh token inválido');
    }
  }

  decodeAccessToken(token: string): IUserFromJwt {
    try {
      return this.jwtService.verify<IUserFromJwt>(token, {
        secret: process.env.JWT_SECRET,
      });
    } catch (err) {
      this.logger.error(err);
      throw new BusinessException('Access token inválido');
    }
  }
}
