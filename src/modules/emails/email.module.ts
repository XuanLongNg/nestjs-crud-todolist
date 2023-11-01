import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import AppConfigModule from '../configs/app.config.module';

@Module({
  imports: [AppConfigModule.register({ folder: '' })],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
