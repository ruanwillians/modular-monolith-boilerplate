import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { UsersController } from './users.controller';
import { LoginUserUseCase } from '../domain/usecases/login-user.usecase';
import { CreateUserUseCase } from '../domain/usecases/create-user.usecase';
import { FindUserUseCase } from '../domain/usecases/find-user.usecase';
import { JwtAuthGuard, RolesGuard } from '@auth/auth';
import { GlobalExceptionFilter } from 'exceptions/exceptions';
import { RefreshTokenUSerUseCase } from '../domain/usecases/refresh-token-user.usecase';

const mockLoginUserUseCase = {
  execute: jest.fn(),
};

const mockCreateUserUseCase = {
  execute: jest.fn(),
};

const mockFindUserUseCase = {
  execute: jest.fn(),
};

const mockRefreshTokenUserUseCase = {
  execute: jest.fn(),
};

describe('UsersController (Integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: LoginUserUseCase, useValue: mockLoginUserUseCase },
        { provide: CreateUserUseCase, useValue: mockCreateUserUseCase },
        { provide: FindUserUseCase, useValue: mockFindUserUseCase },
        {
          provide: RefreshTokenUSerUseCase,
          useValue: mockRefreshTokenUserUseCase,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    app.useGlobalFilters(new GlobalExceptionFilter());
    await app.init();
  });

  beforeEach(() => {
    mockLoginUserUseCase.execute.mockReset();
    mockCreateUserUseCase.execute.mockReset();
    mockFindUserUseCase.execute.mockReset();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/users/login (POST)', () => {
    it('should call LoginUserUseCase and return an access token', async () => {
      const loginDto = { email: 'test@example.com', password: 'password123' };
      const token = { accessToken: 'mock-jwt-token' };
      mockLoginUserUseCase.execute.mockResolvedValue(token);

      const response = await request(app.getHttpServer())
        .post('/users/login')
        .send(loginDto)
        .expect(201);

      expect(mockLoginUserUseCase.execute).toHaveBeenCalledWith(loginDto);
      expect(response.body).toEqual(token);
    });

    it('should return 400 for invalid login DTO (e.g., invalid email and password)', async () => {
      const invalidLoginDto = { email: 'not-an-email', password: '123' };
      const response = await request(app.getHttpServer())
        .post('/users/login')
        .send(invalidLoginDto)
        .expect(400);

      expect(response.body.message).toContain(
        'O e-mail informado não é válido.',
      );

      expect(response.body.message).toContain(
        'A senha deve ter no mínimo 6 caracteres.',
      );
    });
  });

  describe('/users (POST)', () => {
    it('should call CreateUserUseCase and return created user data', async () => {
      const createUserDto = {
        email: 'new@example.com',
        password: 'password123',
      };
      const createdUser = { id: 'new-user-id', email: 'new@example.com' };
      mockCreateUserUseCase.execute.mockResolvedValue(createdUser);

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(201);

      expect(mockCreateUserUseCase.execute).toHaveBeenCalledWith(createUserDto);
      expect(response.body).toEqual(createdUser);
    });
  });

  describe('/users/:id (GET)', () => {
    it('should call FindUserUseCase and return user data', async () => {
      const userId = 'some-user-id';
      const user = { id: userId, email: 'found@example.com' };
      mockFindUserUseCase.execute.mockResolvedValue(user);

      const response = await request(app.getHttpServer())
        .get(`/users/${userId}`)
        .expect(200);

      expect(mockFindUserUseCase.execute).toHaveBeenCalledWith(userId);
      expect(response.body).toEqual(user);
    });
  });
});
