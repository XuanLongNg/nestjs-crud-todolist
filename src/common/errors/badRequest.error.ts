import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  UnauthorizedException,
  NotFoundException,
  HttpStatus,
} from '@nestjs/common';
import e, { Response } from 'express';

@Catch(UnauthorizedException, NotFoundException)
export class BadRequestCustom implements ExceptionFilter {
  catch(
    exception: UnauthorizedException | NotFoundException,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof UnauthorizedException) {
      response
        .status(HttpStatus.UNAUTHORIZED)
        .json({ error: exception.message });
    } else if (exception instanceof NotFoundException) {
      response.status(HttpStatus.NOT_FOUND).json({ error: exception.message });
    }
  }
}
