import { MiddlewareConsumer, Module } from '@nestjs/common';
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
import { ThrottlerModule } from '@nestjs/throttler';
import { UploadModule } from './modules/upload/upload.module';
import { JwtModule } from '@nestjs/jwt';
import { FirebaseModule } from './modules/firebase/firebase.module';
import { LoggerCustom } from './services/logger.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    JwtModule.register({
      global: true,
    }),
    TypeOrmModule.forRoot(config().database as TypeOrmModuleOptions),
    ProfileModule,
    AccountModule,
    AuthModule,
    TodoModule,
    AppConfigModule.register({ folder: '' }),
    EmailModule,
    UploadModule,
    FirebaseModule,
    ThrottlerModule.forRoot([
      {
        ttl: 4000,
        limit: 10,
      },
    ]),
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
export class AppModule {
  // configure(consumer: MiddlewareConsumer){
  //   consumer.apply
  // }
}
