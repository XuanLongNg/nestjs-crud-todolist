import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Account } from '../account/account.entity';
import { LoggerCustom } from 'src/services/logger.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    @Inject('LOGGER') private logger: LoggerCustom,
  ) {
    super();
  }

  async validate(username: string, password: string) {
    const user = await this.authService.validateAccount({
      username: username,
      password: password,
    } as Account);
    if (!user) {
      this.logger.error('Username or password is incorrect');
      throw new UnauthorizedException('Username or password is incorrect');
    }

    return user;
  }
}
