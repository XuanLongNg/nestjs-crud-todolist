import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class RegisterValidation implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const { profile, account } = value;
    const filterPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    const filterEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (!filterEmail.test(profile.email)) {
      throw new BadRequestException('Email format is invalid.');
    }
    if (!filterPassword.test(account.password)) {
      throw new BadRequestException('Password format is invalid.');
    }
    if (!value.role) {
      const { role, ...result } = value;
      return result;
    }
    return value;
  }
}
