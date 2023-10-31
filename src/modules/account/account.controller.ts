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
import { AccountGuard } from './account.guard';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}
  @Get()
  @UseGuards(AccountGuard)
  async findAll(@Res() res) {
    try {
      const data = await this.accountService.findAll();
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @Get(':id')
  @UseGuards(AccountGuard)
  async findOne(@Res() res, @Param('id', ParseIntPipe) id: number) {
    try {
      const data = await this.accountService.findOne({ id: id });
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @Post('new')
  @UseGuards(AccountGuard)
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
        account: account,
        message: `Account id ${account.id} created`,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @Put('update/:id')
  @UseGuards(AccountGuard)
  async update(
    @Res() res,
    @Param('id', ParseIntPipe) id: number,
    @Body() body,
  ) {
    try {
      const data = {
        id: id,
        profile: body.profile,
        username: body.username,
        password: body.password,
        role: body.role,
      } as Account;
      const account = await this.accountService.update(data);
      return res.status(HttpStatus.OK).json({
        account: account,
        message: `Account id ${account.id} created`,
      });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @Delete('delete/:id')
  @UseGuards(AccountGuard)
  async delete(@Res() res, @Param('id', ParseIntPipe) id: number) {
    try {
      await this.accountService.delete({ id: id });
      return res.status(HttpStatus.OK).json({ message: 'Success' });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
}
