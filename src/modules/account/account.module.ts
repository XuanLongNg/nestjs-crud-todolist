import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './account.entity';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { AuthModule } from '../auth/auth.module';
import { AccountGuard } from './account.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Account])],
  providers: [AccountService, AccountGuard],
  controllers: [AccountController],
  exports: [AccountService],
})
export class AccountModule {}
