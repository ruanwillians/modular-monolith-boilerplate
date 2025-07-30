import { UserEntity } from '../entities/user.entity';

export abstract class IUsersRepository {
  abstract findByEmail(email: string): Promise<UserEntity | null>;
  abstract findById(id: string): Promise<UserEntity | null>;
  abstract create(user: UserEntity): Promise<UserEntity>;
}
