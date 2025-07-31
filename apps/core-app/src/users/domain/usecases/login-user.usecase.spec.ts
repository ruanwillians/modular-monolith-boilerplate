import { Test, TestingModule } from '@nestjs/testing';
import { LoginUserUseCase } from './login-user.usecase';
import { IUsersRepository } from '../repositories/users.repository.interface';
import { IAuthService, Role } from '@auth/auth';
import { BusinessException } from 'exceptions/exceptions';
import { UserEntity } from '../entities/user.entity';
import { LoginUserRequestDto } from '../../http/dto/request/login-user-request.dto';
import { LoginUserResponseDto } from '../../http/dto/response/login-user-response.dto';

const mockUsersRepository = {
  findUserByEmail: jest.fn(),
  findUserById: jest.fn(),
  createUser: jest.fn(),
};

const mockAuthService = {
  validatePassword: jest.fn(),
  login: jest.fn(),
  hashPassword: jest.fn(),
};

describe('LoginUserUseCase', () => {
  let useCase: LoginUserUseCase;
  let usersRepository: IUsersRepository;
  let authService: IAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginUserUseCase,
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

    useCase = module.get<LoginUserUseCase>(LoginUserUseCase);
    usersRepository = module.get<IUsersRepository>(IUsersRepository);
    authService = module.get<IAuthService>(IAuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    const loginDto: LoginUserRequestDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    const userEntity = new UserEntity(
      'user-id',
      'test@example.com',
      'hashedPassword',
    );

    it('should successfully log in a user and return login details', async () => {
      mockUsersRepository.findUserByEmail.mockResolvedValue(userEntity);

      jest
        .spyOn(usersRepository, 'findUserByEmail')
        .mockResolvedValue(userEntity);

      jest.spyOn(authService, 'validatePassword').mockResolvedValue(true);

      const loginResponse: LoginUserResponseDto = {
        accessToken: 'some-jwt-token',
      };

      jest.spyOn(authService, 'login').mockResolvedValue(loginResponse);

      const result = await useCase.execute(loginDto);

      expect(usersRepository.findUserByEmail).toHaveBeenCalledWith(
        loginDto.email,
      );
      expect(authService.validatePassword).toHaveBeenCalledWith(
        loginDto.password,
        userEntity.passwordHash,
      );
      expect(authService.login).toHaveBeenCalledWith({
        userId: userEntity.id,
        email: userEntity.email,
        role: Role.User,
      });
      expect(result).toEqual(loginResponse);
    });

    it('should throw a BusinessException if user is not found', async () => {
      jest
        .spyOn(mockUsersRepository, 'findUserByEmail')
        .mockResolvedValue(null);

      await expect(useCase.execute(loginDto)).rejects.toThrow(
        new BusinessException('Usuário não encontrado'),
      );
    });

    it('should throw a BusinessException for an invalid password', async () => {
      jest
        .spyOn(usersRepository, 'findUserByEmail')
        .mockResolvedValue(userEntity);

      jest.spyOn(authService, 'validatePassword').mockResolvedValue(false);

      await expect(useCase.execute(loginDto)).rejects.toThrow(
        new BusinessException('Senha inválida', 401),
      );

      expect(mockUsersRepository.findUserByEmail).toHaveBeenCalledWith(
        loginDto.email,
      );
      expect(mockAuthService.validatePassword).toHaveBeenCalledWith(
        loginDto.password,
        userEntity.passwordHash,
      );
    });
  });
});
