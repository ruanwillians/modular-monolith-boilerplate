import { IUserFromJwt } from '@auth/auth';
import { ILoginResponse } from '../interfaces/login-response.interface';

export interface IAuthService {
  validatePassword(plain: string, hash: string): Promise<boolean>;
  hashPassword(plain: string): Promise<string>;
  login(user: IUserFromJwt): Promise<ILoginResponse>;
}
