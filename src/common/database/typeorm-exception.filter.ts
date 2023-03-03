import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch(QueryFailedError)
export class TypeormExceptionFilter extends BaseExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost): any {
    if (host.getType() !== 'http') {
      return super.catch(exception, host);
    }

    if (exception?.['code'] !== '23505') {
      return super.catch(exception, host);
    }

    return super.catch(new BadRequestException(exception?.['detail']), host);
  }
}
