import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable, map, tap } from 'rxjs';

@Injectable()
export class AccessInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    if (req.headers.role == 'admin') return next.handle();
    if (req.params.id != req.headers.id)
      throw new UnauthorizedException(
        "You don't have permission to access this information",
      );
    return next.handle();
  }
}
