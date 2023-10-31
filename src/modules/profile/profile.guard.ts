import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AccountService } from '../account/account.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class ProfileGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }
  async validateRequest(request) {
    const url = request.url.split('/');
    const token = request.headers.authorization
      ? request.headers.authorization
      : '';
    if (!token) throw new UnauthorizedException('Invalid token');
    const decodeData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    if (url[2] == '' || url[2] == 'delete' || url == 'new')
      return decodeData.role == 'admin';
    return decodeData.role == 'member' || decodeData.role == 'admin';
  }
}
