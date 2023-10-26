import { IsString, IsInt } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  @IsInt()
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
  })
  @IsString()
  name: string;

  @Column({
    type: 'date',
  })
  @IsString()
  dob: string;

  @Column({
    type: 'varchar',
    length: 55,
  })
  @IsString()
  gender: string;

  @Column({
    type: 'text',
  })
  @IsString()
  email: string;

  @Column({
    type: 'text',
  })
  @IsString()
  image: string;
}
