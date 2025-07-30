import { Role } from '../enums/role.enum';

export interface IUserFromJwt {
  userId: string;
  email: string;
  role: Role;
}
