import {
  Body,
  Controller,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

@Controller('api/upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}
  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 100000 })],
      }),
    )
    file: Express.Multer.File,
    @Res() res,
  ) {
    try {
      const url = await this.uploadService.upload(file);
      return res.send({ message: 'Uploaded file successfully', url: url });
    } catch (error) {
      throw error;
    }
  }
}
