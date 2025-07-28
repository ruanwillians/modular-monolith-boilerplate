import { Module } from '@nestjs/common';
import { PostgresDatabaseService } from './postgres-database.service';

@Module({
  providers: [PostgresDatabaseService],
})
export class DatabaseModule {}
