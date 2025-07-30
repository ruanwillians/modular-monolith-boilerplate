import { NestFactory } from '@nestjs/core';
import { AdapterModule } from './adapter.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from 'exceptions/exceptions';

async function bootstrap() {
  const app = await NestFactory.create(AdapterModule);
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
