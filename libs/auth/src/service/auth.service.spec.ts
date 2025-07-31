import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { IUserFromJwt } from '../interfaces/user-from-jwt.interface';
import { Role } from '../enums/role.enum';

jest.mock('@nestjs/jwt', () => ({
  JwtService: jest.fn().mockImplementation(() => ({
    sign: jest.fn(),
  })),
}));

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  let compareSpy: jest.SpyInstance;
  let hashSpy: jest.SpyInstance;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);

    compareSpy = jest.spyOn(bcrypt, 'compare');
    hashSpy = jest.spyOn(bcrypt, 'hash');
  });

  afterEach(() => {
    jest.clearAllMocks();

    compareSpy.mockRestore();
    hashSpy.mockRestore();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return an access token', () => {
      const user: IUserFromJwt = {
        userId: 'some-uuid',
        email: 'test@example.com',
        role: Role.User,
      };
      const token = 'some-jwt-token';
      const payload = {
        sub: user.userId,
        email: user.email,
        role: user.role,
      };

      jest.spyOn(jwtService, 'sign').mockReturnValue(token);

      const result = service.login(user);

      expect(jwtService.sign).toHaveBeenCalledWith(payload);
      expect(result).toEqual({ accessToken: token });
    });
  });

  describe('validatePassword', () => {
    it('should return true for a valid password', async () => {
      const plainPassword = 'password123';
      const hashedPassword = 'hashedPassword';

      compareSpy.mockResolvedValue(true);

      const isValid = await service.validatePassword(
        plainPassword,
        hashedPassword,
      );

      expect(compareSpy).toHaveBeenCalledWith(plainPassword, hashedPassword);
      expect(isValid).toBe(true);
    });

    it('should return false for an invalid password', async () => {
      const plainPassword = 'wrongpassword';
      const hashedPassword = 'hashedPassword';

      compareSpy.mockResolvedValue(false);

      const isValid = await service.validatePassword(
        plainPassword,
        hashedPassword,
      );

      expect(compareSpy).toHaveBeenCalledWith(plainPassword, hashedPassword);
      expect(isValid).toBe(false);
    });
  });

  describe('hashPassword', () => {
    it('should return a hashed password', async () => {
      const plainPassword = 'password123';
      const hashedPassword = 'hashedPassword';

      hashSpy.mockResolvedValue(hashedPassword);

      const result = await service.hashPassword(plainPassword);

      expect(hashSpy).toHaveBeenCalledWith(plainPassword, 10);
      expect(result).toBe(hashedPassword);
    });
  });
});
