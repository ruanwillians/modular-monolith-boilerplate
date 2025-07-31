import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { BusinessException } from 'exceptions/exceptions';
import { IUserFromJwt } from '../interfaces/user-from-jwt.interface';
import { Role } from '../enums/role.enum';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('refreshToken', () => {
    it('should return a new access and refresh token', () => {
      const refreshToken = 'valid-refresh-token';
      const payload: IUserFromJwt = {
        sub: '1',
        email: 'test@example.com',
        role: Role.User,
      };
      const expectedTokens = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      };

      jest.spyOn(jwtService, 'verify').mockReturnValue(payload);
      jest
        .spyOn(jwtService, 'sign')
        .mockImplementationOnce(() => expectedTokens.accessToken)
        .mockImplementationOnce(() => expectedTokens.refreshToken);

      const result = service.refreshToken(refreshToken);

      expect(jwtService.verify).toHaveBeenCalledWith(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      expect(result).toEqual(expectedTokens);
    });
  });

  describe('login', () => {
    it('should return an access and refresh token', () => {
      const user: IUserFromJwt = {
        sub: '1',
        email: 'test@example.com',
        role: Role.User,
      };
      const expectedTokens = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      };

      jest
        .spyOn(jwtService, 'sign')
        .mockImplementationOnce(() => expectedTokens.accessToken)
        .mockImplementationOnce(() => expectedTokens.refreshToken);

      const result = service.login(user);

      expect(result).toEqual(expectedTokens);
    });
  });

  describe('validatePassword', () => {
    it('should return true for a valid password', async () => {
      const plain = 'password';
      const hash = await service.hashPassword(plain);
      const result = await service.validatePassword(plain, hash);
      expect(result).toBe(true);
    });

    it('should return false for an invalid password', async () => {
      const plain = 'password';
      const hash = await service.hashPassword('wrong-password');
      const result = await service.validatePassword(plain, hash);
      expect(result).toBe(false);
    });
  });

  describe('hashPassword', () => {
    it('should return a hashed password', async () => {
      const plain = 'password';
      const hash = await service.hashPassword(plain);
      expect(hash).not.toBe(plain);
      expect(hash).toBeDefined();
    });
  });

  describe('decodeRefreshToken', () => {
    it('should return payload for a valid token', () => {
      const token = 'valid-token';
      const payload: IUserFromJwt = {
        sub: '1',
        email: 'test@example.com',
        role: Role.User,
      };

      jest.spyOn(jwtService, 'verify').mockReturnValue(payload);

      const result = service.decodeRefreshToken(token);

      expect(jwtService.verify).toHaveBeenCalledWith(token, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      expect(result).toEqual(payload);
    });

    it('should throw BusinessException for an invalid token', () => {
      const token = 'invalid-token';

      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw new Error('Invalid token');
      });

      expect(() => service.decodeRefreshToken(token)).toThrow(
        new BusinessException('Refresh token inválido'),
      );
    });
  });

  describe('decodeAccessToken', () => {
    it('should return payload for a valid token', () => {
      const token = 'valid-token';
      const payload: IUserFromJwt = {
        sub: '1',
        email: 'test@example.com',
        role: Role.User,
      };

      jest.spyOn(jwtService, 'verify').mockReturnValue(payload);

      const result = service.decodeAccessToken(token);

      expect(jwtService.verify).toHaveBeenCalledWith(token, {
        secret: process.env.JWT_SECRET,
      });
      expect(result).toEqual(payload);
    });

    it('should throw BusinessException for an invalid token', () => {
      const token = 'invalid-token';

      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw new Error('Invalid token');
      });

      expect(() => service.decodeAccessToken(token)).toThrow(
        new BusinessException('Access token inválido'),
      );
    });
  });
});
