import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class EnvValidationSchema {
  @IsString()
  @IsNotEmpty()
  STAGE: string;

  @IsNumber()
  @IsNotEmpty()
  PORT: number;

  @IsNumber()
  @IsNotEmpty()
  JWT_SECRET: number;

  @IsNumber()
  @IsNotEmpty()
  JWT_EXPIRES_IN: number;
}
