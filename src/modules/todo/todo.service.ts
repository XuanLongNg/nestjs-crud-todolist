import { Repository } from 'typeorm';
import { Todo } from './todo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

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
      const data = await this.todoRepository.find({});
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async findOne({ id }: { id: number }) {
    const data = await this.todoRepository.findOne({ where: { id: id } });
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
      return (await this.todoRepository.save(todo)).id;
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
    } catch (error) {
      throw error;
    }
  }
  async delete({ id }: { id: number }) {
    try {
      await this.todoRepository.delete(id);
    } catch (error) {
      throw error;
    }
  }
}
