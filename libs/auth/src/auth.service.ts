import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UserFromJwt } from './interfaces/user-from-jwt.interface';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  login(user: UserFromJwt) {
    const payload: Omit<JwtPayload, 'iat' | 'exp'> = {
      sub: user.userId,
      email: user.email,
      role: user.role,
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
