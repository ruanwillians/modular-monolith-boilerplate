import { Role } from '../enums/role.enum';

export interface IUserFromJwt {
  sub: string;
  email: string;
  role: Role;
}
