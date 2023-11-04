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
  async length() {
    try {
      return (await this.todoRepository.find({})).length;
    } catch (error) {
      console.log(error);
      throw error;
    }
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
  async create({
    account,
    title,
    description,
    timeStart,
    timeEnd,
    status,
  }: Todo) {
    try {
      const todo = new Todo();
      todo.account = account;
      todo.title = title;
      todo.description = description;
      todo.timeStart = new Date(timeStart);
      todo.timeEnd = new Date(timeEnd);
      todo.status = status;
      await this.todoRepository.save(todo);
      return todo;
    } catch (error) {
      throw error;
    }
  }
  async update({
    id,
    account,
    title,
    description,
    timeStart,
    timeEnd,
    status,
  }: Todo) {
    try {
      const data = await this.todoRepository.find({
        where: {
          id: id,
        },
      });

      if (!data.length) {
        throw new Error('todo does not exist');
      }
      const todo = new Todo();
      todo.id = id;
      todo.account = account;
      todo.title = title;
      todo.description = description;
      todo.timeStart = timeStart;
      todo.timeEnd = timeEnd;
      todo.status = status;
      await this.todoRepository.update(id, todo);
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
    const promiseArray = [];
    for (let i = 0; i < loop; i++) {
      promiseArray.push(this.create(todo));
    }
    const data = await Promise.all(promiseArray);
    return data;
  }
  async delete({ id }: { id: number }) {
    try {
      await this.todoRepository.delete(id);
    } catch (error) {
      throw error;
    }
  }
}
