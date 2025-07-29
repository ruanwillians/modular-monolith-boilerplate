import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { CoreAppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(CoreAppModule);

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

  await app.listen(3001);
}
bootstrap();
