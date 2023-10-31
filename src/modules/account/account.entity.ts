import { IsString, IsInt } from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Profile } from '../profile/profile.entity';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  @IsInt()
  id: number;

  @JoinColumn({ name: 'id_profile' })
  @OneToOne(() => Profile, {
    nullable: false,
  })
  profile: Profile;

  @Column({
    type: 'text',
    unique: true,
  })
  @IsString()
  username: string;

  @Column({
    type: 'text',
  })
  @IsString()
  password: string;

  @Column({
    type: 'varchar',
    length: 55,
  })
  @IsString()
  role: string;
}
