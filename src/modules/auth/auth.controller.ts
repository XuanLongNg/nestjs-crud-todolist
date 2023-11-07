import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Request,
  Response,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Account } from '../account/account.entity';
import { AuthGuard } from './auth.guard';
import { LoginValidation } from 'src/common/pipes/loginValidate.pipe';
import { RegisterValidation } from 'src/common/pipes/registerValidate.pipe';
import { Public } from 'src/common/decorators/publicRoute.decorator';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('api/auth')
export default class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @Public()
  @UseGuards(LocalAuthGuard)
  async login(@Request() req, @Response() res) {
    try {
      const loginResponse = await this.authService.login(req.user);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Login successful',
        ...loginResponse,
      });
    } catch (error) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ error: error.message });
    }
  }

  @Post('register')
  @Public()
  @UseGuards(AuthGuard)
  @UsePipes(new RegisterValidation())
  async register(@Request() req, @Response() res, @Body() body) {
    try {
      const data = {
        profile: body.profile,
        account: { ...body.account, role: 'member' },
      };
      const registerResponse = await this.authService.register(data);
      return res.status(HttpStatus.OK).json({
        message: 'Register successful',
        data: {
          ...registerResponse,
        },
      });
    } catch (error) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ error: error.message });
    }
  }

  @Get('refresh-token')
  @Public()
  @UseGuards(AuthGuard)
  async refreshToken(@Request() req, @Response() res, @Body() body) {
    try {
      const refreshToken = req.headers['authorization'];
      const data = await this.authService.handleRefreshToken(refreshToken);

      return res.json({ message: 'Success', ...data });
    } catch (error) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ error: error.message });
    }
  }

  @Post('reset-password')
  @Public()
  @UseGuards(AuthGuard)
  async resetPassword(@Response() res, @Body() body) {
    try {
      console.log(body);

      await this.authService.resetPassword({
        username: body.username,
        password: body.password,
        otp: body.otp,
      });
      return res.status(HttpStatus.OK).json({ message: 'Success' });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
    }
  }

  @Post('send-mail-reset')
  @Public()
  @UseGuards(AuthGuard)
  async sendMailReset(@Response() res, @Body() body) {
    try {
      await this.authService.sendMailReset(body.email);
      return res.status(HttpStatus.OK).json({ message: 'Success' });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: error });
    }
  }
}
