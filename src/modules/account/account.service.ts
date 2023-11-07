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
  async create(account: Account) {
    try {
      return await this.accountRepository.save(account);
    } catch (error) {
      throw error;
    }
  }
  async update(account: Partial<Account>) {
    try {
      const data = await this.accountRepository.findOne({
        where: [
          {
            id: account.id,
          },
          {
            username: account.username,
          },
        ],
      });

      if (!data) {
        throw new Error('Account does not exist');
      }
      account.password = account.password
        ? await hashText(account.password)
        : data.password;
      await this.accountRepository.update(data.id, account);
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
