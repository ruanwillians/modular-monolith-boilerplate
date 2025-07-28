import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class EnvValidationSchema {
  @IsString()
  @IsNotEmpty()
  STAGE: string;

  @IsNumber()
  @IsNotEmpty()
  PORT: number;

  @IsString()
  @IsNotEmpty()
  JWT_SECRET: string;

  @IsString()
  @IsNotEmpty()
  JWT_EXPIRES_IN: string;

  @IsString()
  @IsNotEmpty()
  DATABASE_URL: string;
}
