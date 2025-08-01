import { Module } from '@nestjs/common';
import { AdapterController } from './app.controller';
import { AdapterService } from './app.service';
import { AuthModule, JwtAuthGuard, RolesGuard } from '@auth/auth';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { EnvValidationSchema } from './config/env-validation.schema';
import { validateSync } from 'class-validator';
import { DatabaseModule } from './database/database.module';

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
  ],
  controllers: [AdapterController],
  providers: [
    AdapterService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AgroApiModule {}
