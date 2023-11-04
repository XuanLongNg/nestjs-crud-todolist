import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class LoginValidation implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const { password } = value;
    const filterPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!filterPassword.test(password)) {
      throw new BadRequestException('Password format is invalid.');
    }
    return value;
  }
}
