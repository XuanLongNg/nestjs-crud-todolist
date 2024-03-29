import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AccountService } from '../account/account.service';
import { Account } from '../account/account.entity';
// import * as jwt from 'jsonwebtoken';
import { AppConfigService } from '../configs/app.config.service';
import { Profile } from '../profile/profile.entity';
import { ProfileService } from '../profile/profile.service';
import { EmailService } from '../emails/email.service';
import { authenticator, totp } from 'otplib';
import { compareText, hashText } from 'src/common/utils/brypt/brypt';
import { JwtService } from '@nestjs/jwt';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AuthService {
  private readonly saltRounds: number;
  private readonly totp;
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private accountService: AccountService,
    private profileService: ProfileService,
    private appConfigService: AppConfigService,
    private emailService: EmailService,
    private jwt: JwtService,
  ) {
    this.saltRounds = 5;
    this.totp = totp;
    this.totp.options = {
      step: 600,
    };
  }
  signToken = <T>(user: T) => {
    const access_token: string = this.jwt.sign({ ...user } as Object, {
      secret: this.appConfigService.getEnv('JWT_ACCESS_SECRET'),
      expiresIn: parseInt(this.appConfigService.getEnv('TTL_ACCESS')),
    });
    const refresh_token: string = this.jwt.sign({ ...user } as Object, {
      secret: this.appConfigService.getEnv('JWT_REFRESH_SECRET'),
      expiresIn: parseInt(this.appConfigService.getEnv('TTL_REFRESH')),
    });
    return { access_token, refresh_token };
  };
  async handleRefreshToken(id) {
    try {
      const refreshToken: string = await this.cacheManager.get(id.toString());

      const decodeData = this.jwt.verify(refreshToken, {
        secret: this.appConfigService.getEnv('JWT_REFRESH_SECRET'),
      });
      delete decodeData.exp;
      const { access_token } = this.signToken(decodeData);
      return {
        data: { ...decodeData },
        access_token,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
  async validateAccount(account: Account) {
    try {
      const accountData = await this.accountService.findOne({
        username: account.username,
      } as Account);
      if (!accountData) return null;
      if (!(await compareText(account.password, accountData.password)))
        return null;

      return {
        ...accountData,
      };
    } catch (error) {
      throw error;
    }
  }
  async login(account: Account) {
    try {
      const { password, ...result } = account;
      const { refresh_token, access_token } = this.signToken<Account>(
        result as Account,
      );

      await this.cacheManager.set(
        account.id.toString(),
        refresh_token,
        parseInt(this.appConfigService.getEnv('TTL_REFRESH')) * 1000,
      );

      return {
        access_token,
        data: { ...result },
      };
    } catch (error) {
      throw error;
    }
  }
  async register({ account, profile }: { account: Account; profile: Profile }) {
    try {
      const checkExits = await this.accountService.findOne({
        username: account.username,
      } as Account);
      if (checkExits) throw new Error(`Username exists`);
      const user = await this.profileService.create(profile);
      const password = await hashText(account.password);
      return await this.accountService.create({
        ...account,
        profile: user,
        password: password,
      });
    } catch (error) {
      throw error;
    }
  }
  async resetPassword({
    username,
    password,
    otp,
  }: {
    username: string;
    password: string;
    otp: string;
  }) {
    try {
      const isVerify = this.totp.verify({
        token: otp,
        secret: this.appConfigService.getEnv('OTP_SECRET'),
      });
      if (!isVerify) {
        throw new BadRequestException('Invalid OTP');
      }
      await this.accountService.update({
        username,
        password,
      } as Account);
    } catch (error) {
      throw error;
    }
  }
  async changePassword(account: Account, password: string) {
    try {
      const result = await this.accountService.update({
        ...account,
        password: password,
      });
      return result;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
  async sendMailReset(email: string) {
    try {
      const otp = this.totp.generate(
        this.appConfigService.getEnv('OTP_SECRET'),
      );

      const info = {
        from: this.appConfigService.getEnv('MAIL_ACCOUNT'),
        to: email,
        subject: 'Email reset password',
        text:
          'This is the password reset email.\nPlease visit the page: https://www.facebook.com/ and enter the OTP code to retrieve your password.' +
          `\nOTP code valid for 10 minutes: ${otp}`,
      };
      await this.emailService.sendEmail(info);
    } catch (error) {
      throw error;
    }
  }
}
