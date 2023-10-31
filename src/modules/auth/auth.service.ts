import { Injectable } from '@nestjs/common';
import { AccountService } from '../account/account.service';
import { Account } from '../account/account.entity';
import * as jwt from 'jsonwebtoken';
import { AppConfigService } from '../configs/app.config.service';
import { Profile } from '../profile/profile.entity';
import { ProfileService } from '../profile/profile.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly saltRounds: number;
  constructor(
    private accountService: AccountService,
    private profileService: ProfileService,
    private appConfigService: AppConfigService,
  ) {
    this.saltRounds = 5;
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

  async login(account: Account) {
    try {
      const accountData = await this.accountService.findOneByUsername(account);
      console.log(await this.hashText(account.password));

      if (!accountData) throw new Error(`Username or password is not correct`);
      if (!(await this.compareText(account.password, accountData.password)))
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
      const password = await this.hashText(account.password);
      return await this.accountService.create({
        ...account,
        profile: user,
        password: password,
      });
    } catch (error) {
      throw error;
    }
  }
  async hashText(plaintext) {
    try {
      const hash = await bcrypt.hash(plaintext, this.saltRounds);
      return hash;
    } catch (error) {
      throw error;
    }
  }
  async compareText(plaintext, hashText) {
    try {
      return await bcrypt.compare(plaintext, hashText);
    } catch (error) {
      throw error;
    }
  }
}
