import { Module } from '@nestjs/common';
import { PrismaDatabaseService } from './prisma-database.service';

@Module({
  providers: [PrismaDatabaseService],
})
export class DatabaseModule {}
