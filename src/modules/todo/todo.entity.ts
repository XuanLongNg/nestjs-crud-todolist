import { IsString, IsInt, IsDate } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToOne,
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
  id_account: number;

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
