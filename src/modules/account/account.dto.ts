import { IsString, IsInt } from 'class-validator';

export class AccountDTO {
  @IsInt()
  id: number;
  @IsInt()
  id_profile: number;
  @IsString()
  username: string;
  @IsString()
  password: string;
  @IsString()
  role: string;
}
