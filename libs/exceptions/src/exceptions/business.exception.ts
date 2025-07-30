import { HttpStatus } from '@nestjs/common';

export class BusinessException extends Error {
  constructor(
    public readonly message: string,
    public readonly httpCode: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    super(message);
    this.name = 'BusinessException';
  }
}
