import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
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
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/constants/role.enum';
import { LoggerCustom } from 'src/services/logger.service';

@Controller('api/auth')
export default class AuthController {
  constructor(
    private authService: AuthService,
    @Inject('LOGGER') private logger: LoggerCustom,
  ) {}

  @Post('login')
  @Public()
  @UseGuards(LocalAuthGuard)
  async login(@Request() req, @Response() res) {
    try {
      const loginResponse = await this.authService.login(req.user);
      return res.json({
        message: 'Login successful',
        ...loginResponse,
      });
    } catch (error) {
      this.logger.error(error.message);
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: error.message, statusCode: HttpStatus.UNAUTHORIZED });
    }
  }

  @Post('register')
  @Public()
  @UseGuards(AuthGuard)
  @UsePipes(new RegisterValidation())
  async register(@Response() res, @Body() body) {
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
      this.logger.error(error.message);

      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: error.message, statusCode: HttpStatus.UNAUTHORIZED });
    }
  }

  @Get('refresh-token')
  @Public()
  @UseGuards(AuthGuard)
  async refreshToken(@Request() req, @Response() res) {
    try {
      const refreshToken = req.headers['id'];
      const data = await this.authService.handleRefreshToken(refreshToken);
      return res.json({ message: 'Success', ...data });
    } catch (error) {
      this.logger.error(error.message);
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: error.message, statusCode: HttpStatus.UNAUTHORIZED });
    }
  }

  @Post('change-password')
  @Roles(Role.ADMIN, Role.MEMBER)
  @UseGuards(AuthGuard)
  async changePassword(@Request() req, @Response() res, @Body() body) {
    try {
      const account = {
        id: req.headers.id,
      } as Account;
      const data = await this.authService.changePassword(
        account,
        body.password,
      );
      return res.send({ message: 'Success' });
    } catch (error) {
      this.logger.error(error.message);
      return res.send({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
  @Post('reset-password')
  @Public()
  @UseGuards(AuthGuard)
  async resetPassword(@Response() res, @Body() body) {
    try {
      await this.authService.resetPassword({
        username: body.username,
        password: body.password,
        otp: body.otp,
      });
      return res.status(HttpStatus.OK).json({ message: 'Success' });
    } catch (error) {
      this.logger.error(error.message);
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.message, statusCode: HttpStatus.BAD_REQUEST });
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
      this.logger.error(error.message);
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.message, statusCode: HttpStatus.BAD_REQUEST });
    }
  }
}
