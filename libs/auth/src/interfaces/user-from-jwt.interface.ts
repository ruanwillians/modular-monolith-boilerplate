import { Role } from '../enums/role.enum';

export interface UserFromJwt {
  userId: number;
  email: string;
  role: Role;
}
