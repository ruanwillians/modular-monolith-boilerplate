import { Injectable } from '@nestjs/common';

@Injectable()
export class AdapterService {
  getHello(): string {
    return 'Hello World!';
  }
}
