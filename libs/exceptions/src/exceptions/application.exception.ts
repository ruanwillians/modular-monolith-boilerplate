import { HttpStatus } from '@nestjs/common';
import { BusinessException } from './business.exception';

export class ApplicationException extends BusinessException {
  constructor(message: string, httpCode: HttpStatus = HttpStatus.BAD_REQUEST) {
    super(message, httpCode);
    this.name = 'ApplicationException';
  }
}
