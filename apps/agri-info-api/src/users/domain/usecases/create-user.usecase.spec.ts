import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserUseCase } from './create-user.usecase';
import { IUsersRepository } from '../repositories/users.repository.interface';
import { IAuthService } from '@auth/auth';
import { BusinessException } from 'exceptions/exceptions';
import { UserEntity } from '../entities/user.entity';
import { CreateUserRequestDto } from '../../http/dto/request/create-user-request.dto';
import { ObjectId } from 'bson';

const mockUsersRepository = {
  findUserByEmail: jest.fn(),
  createUser: jest.fn(),
  findUserById: jest.fn(),
};

const mockAuthService = {
  validatePassword: jest.fn(),
  login: jest.fn(),
  hashPassword: jest.fn(),
};

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let usersRepository: IUsersRepository;
  let authService: IAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserUseCase,
        {
          provide: IUsersRepository,
          useValue: mockUsersRepository,
        },
        {
          provide: IAuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    useCase = module.get<CreateUserUseCase>(CreateUserUseCase);
    usersRepository = module.get<IUsersRepository>(IUsersRepository);
    authService = module.get<IAuthService>(IAuthService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    const createUserDto: CreateUserRequestDto = {
      email: 'test@example.com',
      password: 'password123',
    };
    const hashedPassword = 'hashedPassword123';
    const userId = '688c0d204040ce4e00259e18';

    beforeEach(() => {
      jest.spyOn(ObjectId.prototype, 'toString').mockReturnValue(userId);
    });

    it('should create and return a new user successfully', async () => {
      const userEntity = new UserEntity(
        userId,
        createUserDto.email,
        hashedPassword,
      );

      jest.spyOn(usersRepository, 'findUserByEmail').mockResolvedValue(null);
      jest.spyOn(authService, 'hashPassword').mockResolvedValue(hashedPassword);
      jest.spyOn(usersRepository, 'createUser').mockResolvedValue(userEntity);

      const result = await useCase.execute(createUserDto);

      expect(usersRepository.findUserByEmail).toHaveBeenCalledWith(
        createUserDto.email,
      );
      expect(authService.hashPassword).toHaveBeenCalledWith(
        createUserDto.password,
      );
      expect(usersRepository.createUser).toHaveBeenCalledWith(
        expect.any(UserEntity),
      );
      expect(usersRepository.createUser).toHaveBeenCalledWith(
        expect.objectContaining({
          id: userId,
          email: createUserDto.email,
          passwordHash: hashedPassword,
        }),
      );
      expect(result).toEqual({ id: userId, email: createUserDto.email });
    });

    it('should throw a BusinessException if the user already exists', async () => {
      const existingUser = new UserEntity('id', 'test@example.com', 'hash');
      jest
        .spyOn(usersRepository, 'findUserByEmail')
        .mockResolvedValue(existingUser);

      await expect(useCase.execute(createUserDto)).rejects.toThrow(
        new BusinessException('Usuário já cadastrado', 409),
      );
    });
  });
});
