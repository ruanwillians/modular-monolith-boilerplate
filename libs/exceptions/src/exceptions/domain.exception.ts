import { HttpStatus } from '@nestjs/common';
import { BusinessException } from './business.exception';

export class DomainException extends BusinessException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
    this.name = 'DomainException';
  }
}
