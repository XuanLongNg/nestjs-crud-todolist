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
      const data = await this.accountRepository.find({
        select: ['id', 'id_profile', 'username', 'password', 'role'],
      });
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async findOne({ id }: { id: number }) {
    const data = await this.accountRepository.findOne({
      where: { id: id },
      select: ['id', 'id_profile', 'username', 'password', 'role'],
    });
    if (!data) {
      throw new Error('Account does not exist');
    }
    return data;
  }
  async create({ id_profile, username, password, role }: Account) {
    try {
      const account = new Account();
      account.id_profile = id_profile;
      account.username = username;
      account.password = password;
      account.role = role;
      return (await this.accountRepository.save(account)).id;
    } catch (error) {
      throw error;
    }
  }
  async update({ id, id_profile, username, password, role }: Account) {
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
      account.id_profile = id_profile;
      account.username = username;
      account.password = password;
      account.role = role;
      await this.accountRepository.update(id, account);
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
