import { Controller, Get } from '@nestjs/common';
import { AdapterService } from './app.service';

@Controller()
export class AdapterController {
  constructor(private readonly adapterService: AdapterService) {}

  @Get()
  getHello(): string {
    return this.adapterService.getHello();
  }
}
