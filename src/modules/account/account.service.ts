import { Repository } from 'typeorm';
import { Account } from './account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

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
    try {
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
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async findOne({ id }: { id: number }) {
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
      .where('account.id = :id', { id: id })
      .getOne();
    if (!data) {
      throw new Error('Account does not exist');
    }
    return data;
  }
  async findOneByUsername(account: Account) {
    const data = await this.accountRepository.findOne({
      where: { username: account.username },
    });
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
  async update({ id, profile, username, password, role }: Account) {
    try {
      const data = await this.accountRepository.find({
        where: {
          id: id,
        },
      });

      if (!data.length) {
        throw new Error('Account does not exist');
      }
      const account = new Account();
      account.id = id;
      account.profile = profile;
      account.username = username;
      account.password = password;
      account.role = role;
      await this.accountRepository.update(id, account);
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
