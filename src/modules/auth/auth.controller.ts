import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Account } from '../account/account.entity';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export default class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(AuthGuard)
  async login(@Response() res, @Body() body: Account) {
    try {
      const loginResponse = await this.authService.login(body);
      return res.status(HttpStatus.OK).json({
        message: 'Login successful',
        ...loginResponse,
      });
    } catch (error) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ error: error.message });
    }
  }
  @Post('register')
  @UseGuards(AuthGuard)
  async register(@Request() req, @Response() res, @Body() body) {
    try {
      const data = {
        profile: body.profile,
        account: body.account,
      };
      const registerResponse = await this.authService.register(data);
      return res.status(HttpStatus.OK).json({
        message: 'Register successful',
        ...registerResponse,
      });
    } catch (error) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ error: error.message });
    }
  }

  @Get('refresh-token')
  @UseGuards(AuthGuard)
  async refreshToken(@Request() req, @Response() res, @Body() body) {
    try {
      const refreshToken = req.headers['authorization'];
      const data = await this.authService.handleRefreshToken(refreshToken);

      return res.json({ message: 'Ok', ...data });
    } catch (error) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ error: error.message });
    }
  }
  @Post('reset-password')
  @UseGuards(AuthGuard)
  async resetPassword(@Response() res, @Body() body) {
    try {
      await this.authService.resetPassword({
        username: body.username,
        password: body.password,
        otp: body.otp,
      });
      return res.json({ message: 'Success' });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: error });
    }
  }
  @Post('send-mail-reset')
  @UseGuards(AuthGuard)
  async sendMailReset(@Response() res, @Body() body) {
    try {
      await this.authService.sendMailReset(body.email);
      return res.json({ message: 'done' });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: error });
    }
  }
}
