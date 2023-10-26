import { IsString, IsInt, IsDate } from 'class-validator';

export class TodoDTO {
  @IsInt()
  id: number;
  @IsInt()
  id_account: number;
  @IsString()
  title: string;
  @IsString()
  description: string;
  @IsDate()
  time: Date;
  @IsString()
  status: string;
}
