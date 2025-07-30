import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './service/auth.service';
import { IAuthService } from './service/auth.service.interface';
import { JwtStrategy } from './utils/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.getOrThrow<string>('JWT_EXPIRES_IN'),
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
  ],
  providers: [
    JwtStrategy,
    AuthService,
    { provide: IAuthService, useExisting: AuthService },
  ],
  exports: [IAuthService, AuthService],
})
export class AuthModule {}
