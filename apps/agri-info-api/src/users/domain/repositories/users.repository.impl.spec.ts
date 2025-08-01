import { Test, TestingModule } from '@nestjs/testing';
import { UsersRepositoryImpl } from './users.repository.impl';
import { PrismaDatabaseService } from '../../../database/prisma-database.service';
import { UserEntity } from '../entities/user.entity';
import { ApplicationException } from 'exceptions/exceptions';
import { HttpStatus } from '@nestjs/common';

const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
};

describe('UsersRepositoryImpl', () => {
  let repository: UsersRepositoryImpl;
  let prisma: PrismaDatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersRepositoryImpl,
        {
          provide: PrismaDatabaseService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    repository = module.get<UsersRepositoryImpl>(UsersRepositoryImpl);
    prisma = module.get<PrismaDatabaseService>(PrismaDatabaseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findByEmail', () => {
    it('should return a UserEntity if user is found', async () => {
      const userDb = {
        id: 'user-id',
        email: 'test@example.com',
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(userDb);

      const result = await repository.findUserByEmail('test@example.com');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(result).toBeInstanceOf(UserEntity);
      expect(result?.id).toBe(userDb.id);
      expect(result?.email).toBe(userDb.email);
      expect(result?.passwordHash).toBe(userDb.password);
    });

    it('should return null if user is not found', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

      const result = await repository.findUserByEmail('notfound@example.com');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'notfound@example.com' },
      });
      expect(result).toBeNull();
    });

    it('should throw ApplicationException on database error', async () => {
      const dbError = new Error('Database connection lost');

      jest.spyOn(prisma.user, 'findUnique').mockRejectedValue(dbError);

      await expect(
        repository.findUserByEmail('test@example.com'),
      ).rejects.toThrow(
        new ApplicationException(
          'Ocorreu um erro ao buscar dados',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });

  describe('findById', () => {
    it('should return a UserEntity if user is found', async () => {
      const userDb = {
        id: 'user-id',
        email: 'test@example.com',
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(userDb);

      const result = await repository.findUserById('user-id');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-id' },
      });
      expect(result).toBeInstanceOf(UserEntity);
      expect(result?.id).toBe(userDb.id);
    });

    it('should return null if user is not found', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

      const result = await repository.findUserById('not-found-id');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'not-found-id' },
      });
      expect(result).toBeNull();
    });

    it('should throw ApplicationException on database error', async () => {
      const dbError = new Error('Database connection lost');
      jest.spyOn(prisma.user, 'findUnique').mockRejectedValue(dbError);

      await expect(repository.findUserById('user-id')).rejects.toThrow(
        new ApplicationException(
          'Ocorreu um erro ao buscar dados',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });

  describe('create', () => {
    it('should create and return a UserEntity', async () => {
      const userEntity = new UserEntity(
        'new-user-id',
        'new@example.com',
        'newHashedPassword',
      );

      const createdUserDb = {
        id: userEntity.id!,
        email: userEntity.email,
        password: userEntity.passwordHash,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(prisma.user, 'create').mockResolvedValue(createdUserDb);

      const result = await repository.createUser(userEntity);

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          id: userEntity.id,
          email: userEntity.email,
          password: userEntity.passwordHash,
        },
      });

      expect(result).toBeInstanceOf(UserEntity);
      expect(result.id).toBe(createdUserDb.id);
      expect(result.email).toBe(createdUserDb.email);
      expect(result.passwordHash).toBe(createdUserDb.password);
    });

    it('should throw ApplicationException on database error', async () => {
      const userEntity = new UserEntity(
        'new-user-id',
        'new@example.com',
        'newHashedPassword',
      );
      const dbError = new Error('Unique constraint failed');

      jest.spyOn(prisma.user, 'create').mockRejectedValue(dbError);

      await expect(repository.createUser(userEntity)).rejects.toThrow(
        new ApplicationException('Ocorreu um erro na criação do usuário', 500),
      );
    });
  });
});
