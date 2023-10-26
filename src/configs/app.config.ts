import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { getEnv } from '../utils/getEnv/getEnv';
import * as dotenv from 'dotenv';
dotenv.config();
class AppConfig {
  getConfigDataBase(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: getEnv('HOST'),
      port: parseInt(getEnv('PORT')),
      username: getEnv('USER'),
      password: getEnv('PASSWD'),
      database: getEnv('DATABASE'),
      synchronize: true,
      entities: ['dist/**/*.entity{.ts,.js}'],
    };
  }
}
export default new AppConfig();
