import { IsString, IsInt } from 'class-validator';

export class ProfileDTO {
  @IsInt()
  id: number;
  @IsString()
  name: string;
  @IsString()
  dob: string;
  @IsString()
  gender: string;
  @IsString()
  email: string;
  @IsString()
  image: string;
}
