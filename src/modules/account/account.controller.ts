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
import { AccountService } from './account.service';
import { Account } from './account.entity';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/constants/role.enum';

@Controller('api/account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}
  @Get()
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  async findAll(@Res() res) {
    try {
      const data = await this.accountService.findAll();
      return res.status(HttpStatus.OK).json({ data });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @Get(':id')
  @Roles(Role.ADMIN)
  @Roles(Role.MEMBER)
  @UseGuards(AuthGuard)
  async findOne(@Res() res, @Param('id', ParseIntPipe) id: number) {
    try {
      const data = await this.accountService.findOne({ id: id } as Account);
      return res.status(HttpStatus.OK).json({ data });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  async create(@Res() res, @Body() body) {
    try {
      const data = {
        profile: body.profile,
        username: body.username,
        password: body.password,
        role: body.role,
      } as Account;
      const account = await this.accountService.create(data);
      return res.status(HttpStatus.CREATED).json({
        data: account,
        message: `Account id ${account.id} created`,
      });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @Put(':id')
  @Roles(Role.ADMIN)
  @Roles(Role.MEMBER)
  @UseGuards(AuthGuard)
  async update(
    @Res() res,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: Account,
  ) {
    try {
      const data = {
        id: id,
        ...body,
      } as Account;
      const account = await this.accountService.update(data);
      return res.status(HttpStatus.OK).json({
        data: account,
        message: `Account id ${account.id} updated`,
      });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  async delete(@Res() res, @Param('id', ParseIntPipe) id: number) {
    try {
      await this.accountService.delete({ id: id });
      return res.status(HttpStatus.OK).json({ message: 'Account deleted' });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
}
