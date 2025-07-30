import { IUserFromJwt } from '@auth/auth';
import { ILoginResponse } from '../interfaces/login-response.interface';

export abstract class IAuthService {
  abstract validatePassword(plain: string, hash: string): Promise<boolean>;
  abstract hashPassword(plain: string): Promise<string>;
  abstract login(user: IUserFromJwt): Promise<ILoginResponse>;
}
