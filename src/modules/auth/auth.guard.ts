import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC } from 'src/common/decorators/publicRoute.decorator';
import { Role } from 'src/common/constants/role.enum';
import { ROLES_KEY } from 'src/common/decorators/roles.decorator';
import { JwtService } from '@nestjs/jwt';
import * as request from 'supertest';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwt: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
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
      request.headers.id = decodeData['id'];
      request.headers.role = decodeData['role'];
      return role.some((role) => decodeData['role']?.includes(role));
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
