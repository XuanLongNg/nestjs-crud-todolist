import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Account } from '../account/account.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string) {
    const user = await this.authService.validateAccount({
      username: username,
      password: password,
    } as Account);
    if (!user) {
      throw new UnauthorizedException('Username or password is incorrect');
    }

    return user;
  }
}
