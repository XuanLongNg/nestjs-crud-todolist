import { DynamicModule, Module } from '@nestjs/common';
import { AppConfigService } from './app.config.service';
import { ConfigModule } from '@nestjs/config';
import { CONFIG_OPTIONS } from 'src/common/constants/config.constant';

export interface ConfigModuleOptions {
  folder: string;
}

@Module({})
export default class AppConfigModule {
  static register(options: ConfigModuleOptions): DynamicModule {
    return {
      module: ConfigModule,
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: options,
        },
        AppConfigService,
      ],
      exports: [AppConfigService],
    };
  }
}
