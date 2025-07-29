import { Injectable } from '@nestjs/common';
import { PostgresDatabaseService } from '../database/postgres-database.service';
import { User as PrismaUser } from '@prisma/client';
import { CreateUserRequestDto } from './dto/request/create-user-request.dto';
import { randomUUID } from 'node:crypto';

@Injectable()
export class UsersRepository {
  constructor(private readonly databaseService: PostgresDatabaseService) {}

  async create(userRequest: CreateUserRequestDto): Promise<PrismaUser> {
    const createdUser = await this.databaseService.user.create({
      data: {
        email: userRequest.email,
        password: userRequest.password,
        id: randomUUID(),
      },
    });
    return createdUser;
  }

  async findByEmail(email: string): Promise<PrismaUser | null> {
    const user = await this.databaseService.user.findUnique({
      where: { email },
    });
    return user;
  }

  async findById(id: string): Promise<PrismaUser | null> {
    const user = await this.databaseService.user.findUnique({
      where: { id },
    });
    return user;
  }
}
