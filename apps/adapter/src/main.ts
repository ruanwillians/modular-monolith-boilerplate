import { NestFactory } from '@nestjs/core';
import { AdapterModule } from './adapter.module';

async function bootstrap() {
  const app = await NestFactory.create(AdapterModule);
  await app.listen(process.env.PORT || 3002);
}
bootstrap();
