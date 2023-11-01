import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }
  async validateRequest(request) {
    const url = request.url.split('/');
    if (url[1] == 'auth') return true;
    const token = request.headers.authorization
      ? request.headers.authorization
      : '';
    if (!token) throw new UnauthorizedException('Invalid token');
    const decodeData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    switch (url[1]) {
      case 'account':
        if (!url[2] || url[2] == 'delete' || url[2] == 'new')
          return decodeData.role == 'admin';
        return decodeData.role == 'member' || decodeData.role == 'admin';
      case 'profile':
        if (url[2] == '' || url[2] == 'delete' || url == 'new')
          return decodeData.role == 'admin';
        return decodeData.role == 'member' || decodeData.role == 'admin';
      default:
        return decodeData.role == 'member' || decodeData.role == 'admin';
    }
  }
}
