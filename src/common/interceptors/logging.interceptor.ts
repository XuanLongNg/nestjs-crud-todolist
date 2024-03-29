import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggerCustom } from 'src/services/logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('\x1b[37mBefore...');
    const req = context.switchToHttp().getRequest();
    console.log(
      'Ip req: ' +
        (req.headers['x-forwarded-for'] ||
          req.connection.remoteAddress ||
          req.socket.remoteAddress),
    );
    const now = Date.now();
    return next
      .handle()
      .pipe(tap(() => console.log(`\x1b[37mAfter... ${Date.now() - now}ms`)));
  }
}
