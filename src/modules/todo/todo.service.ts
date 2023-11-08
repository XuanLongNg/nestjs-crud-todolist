import { Repository } from 'typeorm';
import { Todo } from './todo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

export enum Frequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

@Injectable()
export class TodoService {
  @InjectRepository(Todo)
  private readonly todoRepository: Repository<Todo>;
  async checkUser(id_todo: number, id_user: number) {
    try {
      const data = await this.todoRepository.findOne({
        where: {
          id: id_todo,
          account: {
            id: id_user,
          },
        },
      });
      if (!data) return false;
      return true;
    } catch (error) {}
  }
  async findAll() {
    try {
      const data = await this.todoRepository
        .createQueryBuilder('todo')
        .select([
          'todo.id',
          'todo.title',
          'todo.description',
          'todo.status',
          'todo.timeStart',
          'todo.timeEnd',
        ])
        .leftJoinAndSelect('todo.account', 'account')
        .getMany();
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async findOne(todo: Todo) {
    const data = this.todoRepository
      .createQueryBuilder('todo')
      .select([
        'todo.id',
        'todo.title',
        'todo.description',
        'todo.status',
        'todo.timeStart',
        'todo.timeEnd',
      ])
      .leftJoinAndSelect('todo.account', 'account')
      .where(todo)
      .getOne();
    if (!data) {
      throw new Error('todo does not exist');
    }
    return data;
  }
  async create(todo: Todo) {
    try {
      await this.todoRepository.save(todo);
      return todo;
    } catch (error) {
      throw error;
    }
  }
  async update(todo: Partial<Todo>) {
    try {
      const data = await this.findOne({ id: todo.id } as Todo);

      if (!data) {
        throw new Error('todo does not exist');
      }
      await this.todoRepository.update(todo.id, todo);
      return todo;
    } catch (error) {
      throw error;
    }
  }
  async createTodoByFrequently(todo: Todo, frequency: Frequency) {
    const loop = (() => {
      if (frequency === 'daily') return 1;
      else if (frequency === 'weekly') return 7;
      else if (frequency === 'monthly') return 30;
      return 364;
    })();
    const arr = [];
    for (let i = 0; i < loop; i++) {
      arr.push(todo);
    }
    const data = await this.todoRepository.save(arr);
    return data[0];
  }
  async delete({ id }: { id: number }) {
    try {
      await this.todoRepository.delete(id);
    } catch (error) {
      throw error;
    }
  }
}
