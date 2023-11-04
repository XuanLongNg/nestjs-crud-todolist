import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import AuthController from './auth.controller';
import AppConfigModule from '../configs/app.config.module';
import { AccountModule } from '../account/account.module';
import { ProfileModule } from '../profile/profile.module';
import { AuthGuard } from './auth.guard';
import { EmailModule } from '../emails/email.module';
import { LoginValidation } from 'src/common/pipes/loginValidate.pipe';
import { RegisterValidation } from 'src/common/pipes/registerValidate.pipe';

@Module({
  imports: [
    AppConfigModule.register({ folder: '' }),
    AccountModule,
    ProfileModule,
    EmailModule,
  ],
  providers: [AuthService, AuthGuard, LoginValidation, RegisterValidation],
  controllers: [AuthController],
  exports: [AuthGuard],
})
export class AuthModule {}
