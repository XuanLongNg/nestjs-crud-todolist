import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './profile.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProfileService {
  @InjectRepository(Profile)
  private readonly profileRepository: Repository<Profile>;
  async length() {
    try {
      return (await this.profileRepository.find({})).length;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async findAll() {
    try {
      const data = await this.profileRepository.find({});
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async findOne(profile: Profile) {
    try {
      const data = await this.profileRepository.findOne({ where: profile });
      console.log(data);

      if (!data) {
        throw new Error('Profile does not exist');
      }
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async create(profile: Profile) {
    try {
      return await this.profileRepository.save(profile);
    } catch (error) {
      throw error;
    }
  }
  async update(profile: Partial<Profile>) {
    try {
      const data = await this.findOne({ id: profile.id } as Profile);

      if (!data) {
        throw new Error('Profile does not exist');
      }
      await this.profileRepository.update(profile.id, profile);
      return profile;
    } catch (error) {
      throw error;
    }
  }
  async delete({ id }: { id: number }) {
    try {
      await this.profileRepository.delete(id);
    } catch (error) {
      throw error;
    }
  }
}
