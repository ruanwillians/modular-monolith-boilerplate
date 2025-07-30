import { Module } from '@nestjs/common';
import { GlobalExceptionFilter } from './filters/business-exception.filter';

@Module({
  providers: [GlobalExceptionFilter],
  exports: [ExceptionsModule, GlobalExceptionFilter],
})
export class ExceptionsModule {}
