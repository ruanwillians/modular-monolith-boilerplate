import { UserEntity } from '../entities/user.entity';

export abstract class IUsersRepository {
  abstract findUserByEmail(email: string): Promise<UserEntity | null>;
  abstract findUserById(id: string): Promise<UserEntity | null>;
  abstract createUser(user: UserEntity): Promise<UserEntity>;
}
