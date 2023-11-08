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
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TodoService, Frequency } from './todo.service';
import { Todo } from './todo.entity';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/constants/role.enum';
import { FilterTodoInterceptor } from 'src/common/interceptors/filterTodoByUser.interceptor';
import { Response } from 'express';

@Controller('api/todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}
  @Get()
  @Roles(Role.ADMIN, Role.MEMBER)
  @UseGuards(AuthGuard)
  @UseInterceptors(FilterTodoInterceptor)
  async findAll() {
    const data = await this.todoService.findAll();
    return data;
  }
  @Get(':id')
  @Roles(Role.ADMIN, Role.MEMBER)
  @UseGuards(AuthGuard)
  async findOne(@Res() res, @Param('id', ParseIntPipe) id: number, @Req() req) {
    try {
      if (!(await this.todoService.checkUser(id, req.headers.id)))
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: "You don't have permission to access this todo" });
      const data = await this.todoService.findOne({ id: id } as Todo);
      return res.status(HttpStatus.OK).json({ data });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
  @Post()
  @Roles(Role.ADMIN, Role.MEMBER)
  @UseGuards(AuthGuard)
  async create(@Res() res, @Body() body, @Req() req) {
    try {
      const data = {
        account: {
          id: req.headers.id,
        },
        title: body.title,
        description: body.description,
        timeStart: body.timeStart,
        timeEnd: body.timeEnd,
        status: body.status,
      } as Todo;
      const dataResponse = await this.todoService.create(data);
      return res.status(HttpStatus.CREATED).json({
        data: dataResponse,
        message: `todo id ${dataResponse.id} created`,
      });
    } catch (error) {
      console.log(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
  @Put(':id')
  @Roles(Role.ADMIN, Role.MEMBER)
  @UseGuards(AuthGuard)
  async update(
    @Res() res,
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() body,
  ) {
    try {
      if (!(await this.todoService.checkUser(id, req.headers.id)))
        return res.status(HttpStatus.UNAUTHORIZED).json({
          message: "You don't have permission to access this information",
        });
      const data = {
        id: id,
        title: body.title,
        description: body.description,
        timeStart: body.timeStart,
        timeEnd: body.timeEnd,
        status: body.status,
      } as Todo;
      const dataResponse = await this.todoService.update(data);
      return res
        .status(HttpStatus.OK)
        .json({ message: 'Success', data: dataResponse });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
  @Delete(':id')
  @Roles(Role.ADMIN, Role.MEMBER)
  @UseGuards(AuthGuard)
  async delete(@Res() res, @Param('id', ParseIntPipe) id: number, @Req() req) {
    try {
      if (!(await this.todoService.checkUser(id, req.headers.id)))
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: "You don't have permission to access this todo" });
      await this.todoService.delete({ id: id });
      return res.status(HttpStatus.OK).json({ message: 'Todo deleted' });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
  @Post('frequency')
  @Roles(Role.ADMIN, Role.MEMBER)
  @UseGuards(AuthGuard)
  async createTodoByFrequently(@Res() res, @Body() body, @Req() req) {
    try {
      const data = {
        account: {
          id: req.headers.id,
        },
        title: body.title,
        description: body.description,
        timeStart: body.timeStart,
        timeEnd: body.timeEnd,
        status: body.status,
      } as Todo;
      const dataResponse = await this.todoService.createTodoByFrequently(
        data,
        body.frequency,
      );
      return res
        .status(HttpStatus.CREATED)
        .json({ message: `todo created`, data: dataResponse });
    } catch (error) {
      console.log(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
