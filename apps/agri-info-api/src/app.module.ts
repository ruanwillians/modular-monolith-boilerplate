import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvValidationSchema } from './config/env-validation.schema';
import { ConfigModule } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule, JwtAuthGuard, RolesGuard } from '@auth/auth';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { ExceptionsModule } from 'exceptions/exceptions';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.STAGE}`],
      isGlobal: true,
      validate: (config) => {
        const validatedConfig = plainToInstance(EnvValidationSchema, config, {
          enableImplicitConversion: true,
        });

        const errors = validateSync(validatedConfig, {
          skipMissingProperties: false,
        });

        if (errors.length > 0) {
          throw new Error(
            `Config validation error: ${errors.map((err) => err.toString()).join(', ')}`,
          );
        }

        return validatedConfig;
      },
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    ExceptionsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AgriInfoApiModule {}
