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
  async findOne({ id }: { id: number }) {
    try {
      const data = await this.profileRepository.findOne({ where: { id: id } });
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
  async create({ name, dob, gender, email, image }: Profile) {
    try {
      const profile = new Profile();
      profile.name = name;
      profile.dob = dob;
      profile.gender = gender;
      profile.email = email;
      profile.image = image;
      return (await this.profileRepository.save(profile)).id;
    } catch (error) {
      throw error;
    }
  }
  async update({ id, name, dob, gender, email, image }: Profile) {
    try {
      const data = await this.profileRepository.find({
        where: {
          id: id,
        },
      });

      if (!data.length) {
        throw new Error('Profile does not exist');
      }
      const profile = new Profile();
      profile.id = id;
      profile.name = name;
      profile.dob = dob;
      profile.gender = gender;
      profile.email = email;
      profile.image = image;
      await this.profileRepository.update(id, profile);
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
