import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, map, tap } from 'rxjs';

@Injectable()
export class FilterTodoInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    return next.handle().pipe(
      map((data) => {
        data = data.filter((data) => data.account.id == req.headers.id);
        return data;
      }),
    );
  }
}
