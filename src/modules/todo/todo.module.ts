import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './todo.entity';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { AuthModule } from '../auth/auth.module';
import { TodoGuard } from './todo.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Todo])],
  providers: [TodoService, TodoGuard],
  controllers: [TodoController],
})
export class TodoModule {}
