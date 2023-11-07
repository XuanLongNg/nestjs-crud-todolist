import { Module } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import AppConfigModule from '../configs/app.config.module';

@Module({
  imports: [AppConfigModule.register({ folder: '' })],
  providers: [FirebaseService],
  exports: [FirebaseService],
})
export class FirebaseModule {}
