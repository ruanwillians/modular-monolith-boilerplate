import { Role } from '../enums/role.enum';

export interface IJwtPayload {
  sub: string;
  email: string;
  role: Role;
  iat?: number;
  exp?: number;
}
