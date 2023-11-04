import { FindOneOptions, Repository } from 'typeorm';
import { Account } from './account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Profile } from '../profile/profile.entity';
import { hashText } from 'src/common/utils/brypt/brypt';

@Injectable()
export class AccountService {
  @InjectRepository(Account)
  private readonly accountRepository: Repository<Account>;
  async length() {
    try {
      return (await this.accountRepository.find({})).length;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async findAll() {
    const data = await this.accountRepository
      .createQueryBuilder('account')
      .select([
        'account.id',
        'account.password',
        'account.role',
        'account.username',
        'profile.id',
        'profile.name',
      ])
      .leftJoinAndSelect('account.profile', 'profile')
      .getMany();
    return data;
  }
  async findOne(account: Account) {
    const data = await this.accountRepository
      .createQueryBuilder('account')
      .select([
        'account.id',
        'account.password',
        'account.role',
        'account.username',
        'profile.id',
        'profile.name',
      ])
      .leftJoinAndSelect('account.profile', 'profile')
      .where(account)
      .getOne();
    return data;
  }
  async create({ profile, username, password, role }: Account) {
    try {
      const account = new Account();
      account.profile = profile;
      account.username = username;
      account.password = password;
      account.role = role;
      return await this.accountRepository.save(account);
    } catch (error) {
      throw error;
    }
  }
  async update({
    id,
    profile,
    username,
    password,
    role,
  }: {
    id?: number;
    profile?: Profile;
    username?: string;
    password?: string;
    role?: string;
  }) {
    try {
      const data = await this.findOne({
        id: id,
        username: username,
      } as Account);

      if (!data) {
        throw new Error('Account does not exist');
      }
      const account = new Account();
      account.id = id || data.id;
      account.profile = profile || data.profile;
      account.username = username || data.username;
      account.password = password ? await hashText(password) : data.password;
      account.role = role || data.role;
      await this.accountRepository.update(account.id, account);
      return account;
    } catch (error) {
      throw error;
    }
  }
  async delete({ id }: { id: number }) {
    try {
      await this.accountRepository.delete(id);
    } catch (error) {
      throw error;
    }
  }
}
