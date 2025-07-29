import { Role } from '../enums/role.enum';

export interface UserFromJwt {
  userId: string;
  email: string;
  role: Role;
}
