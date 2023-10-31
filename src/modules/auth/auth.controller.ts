import {
  Body,
  Controller,
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
  async login(@Request() req, @Response() res, @Body() body: Account) {
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
}
