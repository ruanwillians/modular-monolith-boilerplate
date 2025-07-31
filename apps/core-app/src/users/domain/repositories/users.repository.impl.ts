import { Injectable, HttpStatus } from '@nestjs/common';
import { PostgresDatabaseService } from '../../../database/postgres-database.service';
import { UserEntity } from '../entities/user.entity';
import { IUsersRepository } from './users.repository.interface';
import { ApplicationException } from 'exceptions/exceptions';

@Injectable()
export class UsersRepositoryImpl implements IUsersRepository {
  constructor(private readonly prisma: PostgresDatabaseService) {}

  async findUserByEmail(email: string): Promise<UserEntity | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });
      if (!user) return null;
      return new UserEntity(user.id, user.email, user.password);
    } catch (error) {
      console.error(
        'Erro no banco de dados ao buscar usuário por e-mail:',
        error,
      );
      throw new ApplicationException(
        'Ocorreu um erro ao buscar dados',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findUserById(id: string): Promise<UserEntity | null> {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) return null;
      return new UserEntity(user.id, user.email, user.password);
    } catch (error) {
      console.error('Erro no banco de dados ao buscar usuário por ID:', error);
      throw new ApplicationException(
        'Ocorreu um erro ao buscar dados',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createUser(userEntity: UserEntity): Promise<UserEntity> {
    try {
      const user = await this.prisma.user.create({
        data: {
          id: userEntity.id,
          email: userEntity.email,
          password: userEntity.passwordHash,
        },
      });
      return new UserEntity(user.id, user.email, user.password);
    } catch (error) {
      console.error('Erro no banco de dados ao criar usuário:', error);
      throw new ApplicationException(
        'Ocorreu um erro na criação do usuário',
        500,
      );
    }
  }
}
