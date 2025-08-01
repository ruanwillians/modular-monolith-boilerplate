import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from 'exceptions/exceptions';
import { AgroApiModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AgroApiModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      validationError: {
        target: false,
        value: false,
      },
    }),
  );
  app.useGlobalFilters(new GlobalExceptionFilter());
  await app.listen(3002);
}
bootstrap();
