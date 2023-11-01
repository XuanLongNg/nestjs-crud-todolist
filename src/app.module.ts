import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProfileModule } from './modules/profile/profile.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AccountModule } from './modules/account/account.module';
import { TodoModule } from './modules/todo/todo.module';
import { ConfigModule } from '@nestjs/config';
import { config } from './common/configs/config';
import AppConfigModule from './modules/configs/app.config.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_FILTER } from '@nestjs/core';
import { BadRequestCustom } from './common/errors/badRequest.error';
import { EmailModule } from './modules/emails/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => config],
    }),
    TypeOrmModule.forRoot(config().database as TypeOrmModuleOptions),
    ProfileModule,
    AccountModule,
    AuthModule,
    TodoModule,
    AppConfigModule.register({ folder: '' }),
    EmailModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: BadRequestCustom,
    },
  ],
})
export class AppModule {}
