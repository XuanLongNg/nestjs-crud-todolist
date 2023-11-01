import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AccountService } from '../account/account.service';
import { Account } from '../account/account.entity';
import * as jwt from 'jsonwebtoken';
import { AppConfigService } from '../configs/app.config.service';
import { Profile } from '../profile/profile.entity';
import { ProfileService } from '../profile/profile.service';
import { EmailService } from '../emails/email.service';
import { authenticator, totp } from 'otplib';
import { compareText, hashText } from 'src/common/utils/brypt/brypt';
// import * as totp from 'otplib';

@Injectable()
export class AuthService {
  private readonly saltRounds: number;
  private readonly totp;
  constructor(
    private accountService: AccountService,
    private profileService: ProfileService,
    private appConfigService: AppConfigService,
    private emailService: EmailService,
  ) {
    this.saltRounds = 5;
    this.totp = totp;
    this.totp.options = {
      step: 600,
    };
  }
  signToken = <T>(user: T) => {
    const access_token: string = jwt.sign(
      { ...user },
      this.appConfigService.getEnv('JWT_ACCESS_SECRET'),
      { expiresIn: 60 * 60 * 24 },
    );
    const refresh_token: string = jwt.sign(
      { ...user },
      this.appConfigService.getEnv('JWT_REFRESH_SECRET'),
      { expiresIn: Math.pow(60, 15) },
    );

    return { access_token, refresh_token };
  };
  async handleRefreshToken(refreshToken: string) {
    const decodeData = jwt.verify(
      refreshToken,
      this.appConfigService.getEnv('JWT_REFRESH_SECRET'),
    );
    if (!decodeData) throw new UnauthorizedException('Invalid refresh token');
    delete decodeData.exp;
    const { access_token, refresh_token } = this.signToken(decodeData);
    return {
      ...decodeData,
      access_token,
      refresh_token,
    };
  }
  async login(account: Account) {
    try {
      const accountData = await this.accountService.findOneByUsername(account);
      if (!accountData) throw new Error(`Username or password is not correct`);
      if (!(await compareText(account.password, accountData.password)))
        throw new Error(`Username or password is not correct`);
      const { refresh_token, access_token } =
        this.signToken<Account>(accountData);

      return {
        access_token,
        refresh_token,
        data: { ...accountData },
      };
    } catch (error) {
      throw error;
    }
  }
  async register({ account, profile }: { account: Account; profile: Profile }) {
    try {
      const checkExits = await this.accountService.findOneByUsername(account);
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
      console.log(username, password, otp, isVerify);
      if (!isVerify) {
        throw new BadRequestException('Invalid OTP');
      }
      await this.accountService.update({
        username,
        password,
      } as Account);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async sendMailReset(email: string) {
    try {
      const otp = this.totp.generate(
        this.appConfigService.getEnv('OTP_SECRET'),
      );
      console.log(otp);

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
