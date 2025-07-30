import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ApplicationException } from '../exceptions/application.exception';
import { DomainException } from '../exceptions/domain.exception';
import { BusinessException } from '../exceptions/business.exception';

@Catch(BusinessException, ApplicationException, DomainException)
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(
    exception: {
      httpCode?: HttpStatus;
      message: string;
      name: string;
    },
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.httpCode || HttpStatus.BAD_REQUEST;

    return response.status(status).json({
      statusCode: status,
      message: exception.message,
      error: exception.name,
      timestamp: new Date().toISOString(),
    });
  }
}
