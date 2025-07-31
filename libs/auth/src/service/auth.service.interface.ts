import { IUserFromJwt } from '@auth/auth';
import { ILoginResponse } from '../interfaces/login-response.interface';

export abstract class IAuthService {
  abstract validatePassword(plain: string, hash: string): Promise<boolean>;
  abstract hashPassword(plain: string): Promise<string>;
  abstract login(user: IUserFromJwt): ILoginResponse;
  abstract refreshToken(token: string): ILoginResponse;
  abstract decodeRefreshToken(token: string): IUserFromJwt;
  abstract decodeAccessToken(token: string): IUserFromJwt;
}
