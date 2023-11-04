import { SetMetadata } from '@nestjs/common';
import { Role } from '../constants/role.enum';

export const IS_PUBLIC = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC, true);
