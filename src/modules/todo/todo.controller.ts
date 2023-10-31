import {
  Body,
  Catch,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { Todo } from './todo.entity';
import { TodoGuard } from './todo.guard';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}
  @Get()
  @UseGuards(TodoGuard)
  async findAll(@Res() res) {
    try {
      const data = await this.todoService.findAll();
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @Get(':id')
  @UseGuards(TodoGuard)
  async findOne(@Res() res, @Param('id', ParseIntPipe) id: number) {
    try {
      const data = await this.todoService.findOne({ id: id });
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @Post('new')
  @UseGuards(TodoGuard)
  async create(@Res() res, @Body() body) {
    try {
      const data = {
        account: body.account,
        title: body.title,
        description: body.description,
        timeStart: body.timeStart,
        timeEnd: body.timeEnd,
        status: body.status,
      } as Todo;
      const id = await this.todoService.create(data);
      return res
        .status(HttpStatus.CREATED)
        .json({ id: id, message: `todo id ${id} created` });
    } catch (error) {
      console.log(error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @Put('update/:id')
  @UseGuards(TodoGuard)
  async update(
    @Res() res,
    @Param('id', ParseIntPipe) id: number,
    @Body() body,
  ) {
    try {
      const data = {
        id: id,
        account: body.account,
        title: body.title,
        description: body.description,
        timeStart: body.timeStart,
        timeEnd: body.timeEnd,
        status: body.status,
      } as Todo;
      await this.todoService.update(data);
      return res.status(HttpStatus.OK).json({ message: 'Success' });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @Delete('delete/:id')
  @UseGuards(TodoGuard)
  async delete(@Res() res, @Param('id', ParseIntPipe) id: number) {
    try {
      await this.todoService.delete({ id: id });
      return res.status(HttpStatus.OK).json({ message: 'Success' });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
}
