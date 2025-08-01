import { Test, TestingModule } from '@nestjs/testing';
import { IUsersRepository } from '../repositories/users.repository.interface';
import { BusinessException } from 'exceptions/exceptions';
import { UserEntity } from '../entities/user.entity';
import { FindUserResponseDto } from '../../http/dto/response/find-user-response.dto';
import { FindUserUseCase } from './find-user.usecase';

const mockUsersRepository = {
  findUserById: jest.fn(),
  findUserByEmail: jest.fn(),
  createUser: jest.fn(),
};

describe('FindUserUseCase', () => {
  let useCase: FindUserUseCase;
  let usersRepository: IUsersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindUserUseCase,
        {
          provide: IUsersRepository,
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    useCase = module.get<FindUserUseCase>(FindUserUseCase);
    usersRepository = module.get<IUsersRepository>(IUsersRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    const userId = 'user-id-123';
    const userEntity = new UserEntity(
      userId,
      'test@example.com',
      'hashedPassword',
    );

    it('should return user data if a user is found', async () => {
      jest.spyOn(usersRepository, 'findUserById').mockResolvedValue(userEntity);

      const expectedResponse: FindUserResponseDto = {
        id: userEntity.id,
        email: userEntity.email,
      };

      const result = await useCase.execute(userId);

      expect(usersRepository.findUserById).toHaveBeenCalledWith(userId);
      expect(result).toEqual(expectedResponse);
    });

    it('should throw a BusinessException if the user is not found', async () => {
      const nonExistentId = 'non-existent-id';

      jest.spyOn(usersRepository, 'findUserById').mockResolvedValue(null);

      await expect(useCase.execute(nonExistentId)).rejects.toThrow(
        new BusinessException('Usuário não encontrado', 404),
      );
    });
  });
});
