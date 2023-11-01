import { Inject, Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}
  getEnv(env: string) {
    const value = this.configService.get(env);
    if (value) {
      return value;
    }
    throw new Error(`Could not find environment variable: ` + env);
  }
}
