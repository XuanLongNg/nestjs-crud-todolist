import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC } from 'src/common/decorators/publicRoute.decorator';
import { Role } from 'src/common/constants/role.enum';
import { ROLES_KEY } from 'src/common/decorators/roles.decorator';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwt: JwtService,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
      context.getHandler(),
      context.getClass(),
    ]);
    const role = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;
    return this.validateRequest(request, role);
  }
  async validateRequest(request, role) {
    try {
      const token = request.headers.authorization
        ? request.headers.authorization
        : '';
      if (!token) throw new UnauthorizedException('Invalid token');

      const decodeData = this.jwt.verify(token, {
        secret: process.env.JWT_ACCESS_SECRET,
      });
      return role.some((role) => decodeData.role?.includes(role));
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
