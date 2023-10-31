import { IsString, IsInt, IsDate } from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from '../account/account.entity';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  @IsInt()
  id: number;

  @JoinColumn({ name: 'id_account' })
  @ManyToOne(() => Account, {
    nullable: false,
  })
  account: Account;

  @Column({
    type: 'text',
  })
  @IsString()
  title: string;

  @Column({
    type: 'text',
  })
  @IsString()
  description: string;

  @Column({
    type: 'varchar',
    length: 55,
  })
  @IsString()
  status: string;

  @Column({
    type: 'timestamp',
  })
  @IsDate()
  timeStart: Date;

  @Column({
    type: 'timestamp',
  })
  @IsDate()
  timeEnd: Date;
}
