import { Inject, Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}
  getConfigDataBase(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.getEnv('DB_HOST'),
      port: parseInt(this.getEnv('DB_PORT')),
      username: this.getEnv('DB_USER'),
      password: this.getEnv('DB_PASSWD'),
      database: this.getEnv('DB_DATABASE'),
      synchronize: true,
      entities: ['dist/**/*.entity{.ts,.js}'],
    };
  }
  getEnv(env: string) {
    const value = this.configService.get(env);
    if (value) {
      return value;
    }
    throw new Error(`Could not find environment variable: ` + env);
  }
}
