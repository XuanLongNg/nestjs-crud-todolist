import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { Profile } from './profile.entity';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/constants/role.enum';
import { AccessInterceptor } from 'src/common/interceptors/accessInformation.interceptor';

@Controller('api/profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}
  @Get()
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  async findAll(@Res() res) {
    try {
      const data = await this.profileService.findAll();
      return res.status(HttpStatus.OK).json({ data });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({
          message: error.message,
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        });
    }
  }
  @Get(':id')
  @Roles(Role.ADMIN, Role.MEMBER)
  @UseGuards(AuthGuard)
  @UseInterceptors(AccessInterceptor)
  async findOne(@Res() res, @Param('id', ParseIntPipe) id: number) {
    try {
      const data = await this.profileService.findOne({ id: id } as Profile);
      return res.status(HttpStatus.OK).json({ data });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  async create(@Res() res, @Body() body) {
    try {
      const data = {
        name: body.name,
        dob: body.dob,
        gender: body.gender,
        email: body.email,
        image: body.image,
      } as Profile;
      const profile = await this.profileService.create(data);
      return res.status(HttpStatus.CREATED).json({
        data: profile,
        message: `Profile id ${profile.id} created`,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
  @Put(':id')
  @Roles(Role.ADMIN, Role.MEMBER)
  @UseInterceptors(AccessInterceptor)
  @UseGuards(AuthGuard)
  async update(
    @Res() res,
    @Param('id', ParseIntPipe) id: number,
    @Body() body,
  ) {
    try {
      const data = {
        id: id,
        name: body.name,
        dob: body.dob,
        gender: body.gender,
        email: body.email,
        image: body.image,
      };
      const profile = await this.profileService.update(data);
      return res.status(HttpStatus.OK).json({
        data: profile,
        message: `Profile id ${profile.id} updated successfully`,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  async delete(@Res() res, @Param('id', ParseIntPipe) id: number) {
    try {
      await this.profileService.delete({ id: id });
      return res.status(HttpStatus.OK).json({ message: 'Success' });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
