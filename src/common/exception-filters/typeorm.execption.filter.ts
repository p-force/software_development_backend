import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { Response } from 'express';
import { errorMessage } from '../messages/error/error.messages';

enum pgErrors {
  not_null_violation = 23502,
  unique_violation = 23505,
}

@Catch(QueryFailedError)
export class TypeormExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let statusCode;
    let message;

    switch (parseInt(exception?.driverError?.code)) {
      case pgErrors.not_null_violation:
        statusCode = 400;
        message = errorMessage.server.notNullViolation;
        break;
      case pgErrors.unique_violation:
        statusCode = 400;
        message = errorMessage.server.canNotAddDuplicateEntity;
        break;
      default:
        statusCode = 500;
        message = exception.message;
        break;
    }
    response.status(400).json({
      statusCode,
      message,
    });
  }
}
