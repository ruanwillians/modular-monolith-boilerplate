import { Module } from '@nestjs/common';
import { AdapterController } from './adapter.controller';
import { AdapterService } from './adapter.service';

@Module({
  imports: [],
  controllers: [AdapterController],
  providers: [AdapterService],
})
export class AdapterModule {}
