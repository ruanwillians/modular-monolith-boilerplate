import { Test, TestingModule } from '@nestjs/testing';
import { RefreshTokenUSerUseCase } from './refresh-token-user.usecase';
import { IUsersRepository } from '../repositories/users.repository.interface';
import { IAuthService, IUserFromJwt, Role } from '@auth/auth';
import { BusinessException } from 'exceptions/exceptions';
import { RefreshTokenUserRequestDto } from '../../http/dto/request/refresh-token-user-request.dto';
import { LoginUserResponseDto } from '../../http/dto/response/login-user-response.dto';
import { UserEntity } from '../entities/user.entity';

const mockUsersRepository = {
  findUserById: jest.fn(),
};

const mockAuthService = {
  decodeRefreshToken: jest.fn(),
  refreshToken: jest.fn(),
};

describe('RefreshTokenUSerUseCase', () => {
  let useCase: RefreshTokenUSerUseCase;
  let usersRepository: IUsersRepository;
  let authService: IAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshTokenUSerUseCase,
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

    useCase = module.get<RefreshTokenUSerUseCase>(RefreshTokenUSerUseCase);
    usersRepository = module.get<IUsersRepository>(IUsersRepository);
    authService = module.get<IAuthService>(IAuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const refreshTokenDto: RefreshTokenUserRequestDto = {
    refreshToken: 'valid-refresh-token',
    userId: '',
  };

  const decodedToken: IUserFromJwt = {
    sub: 'user-id',
    email: 'test@example.com',
    role: Role.User,
  };

  const userEntity = new UserEntity(
    decodedToken.sub,
    decodedToken.email,
    'hashed-password',
  );

  const loginResponse: LoginUserResponseDto = {
    accessToken: 'new-access-token',
    refreshToken: 'new-refresh-token',
  };

  it('should return new tokens if refresh token is valid and user exists', async () => {
    jest.spyOn(authService, 'decodeRefreshToken').mockReturnValue(decodedToken);

    jest.spyOn(usersRepository, 'findUserById').mockResolvedValue(userEntity);

    jest.spyOn(authService, 'refreshToken').mockReturnValue(loginResponse);

    const result = await useCase.execute(refreshTokenDto);

    expect(authService.decodeRefreshToken).toHaveBeenCalledWith(
      refreshTokenDto.refreshToken,
    );
    expect(usersRepository.findUserById).toHaveBeenCalledWith(decodedToken.sub);
    expect(authService.refreshToken).toHaveBeenCalledWith(
      refreshTokenDto.refreshToken,
    );
    expect(result).toEqual(loginResponse);
  });

  it('should throw BusinessException if user is not found', async () => {
    jest.spyOn(authService, 'decodeRefreshToken').mockReturnValue(decodedToken);

    jest.spyOn(usersRepository, 'findUserById').mockResolvedValue(null);

    await expect(useCase.execute(refreshTokenDto)).rejects.toThrow(
      new BusinessException('Usuário não encontrado'),
    );

    expect(authService.decodeRefreshToken).toHaveBeenCalledWith(
      refreshTokenDto.refreshToken,
    );
    expect(usersRepository.findUserById).toHaveBeenCalledWith(decodedToken.sub);
  });
});
