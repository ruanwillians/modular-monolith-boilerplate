import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { IUserFromJwt } from '../interfaces/user-from-jwt.interface';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  login(user: IUserFromJwt) {
    const payload = {
      sub: user.userId,
      email: user.email,
      role: user.role,
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async validatePassword(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }

  async hashPassword(plain: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(plain, saltRounds);
  }
}
