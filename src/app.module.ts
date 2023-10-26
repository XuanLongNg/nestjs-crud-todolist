import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProfileModule } from './modules/profile/profile.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import AppConfig from './configs/app.config';
import { AccountModule } from './modules/account/account.module';
import { TodoModule } from './modules/todo/todo.module';

@Module({
  imports: [
    ProfileModule,
    AccountModule,
    TodoModule,
    TypeOrmModule.forRoot(AppConfig.getConfigDataBase()),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
