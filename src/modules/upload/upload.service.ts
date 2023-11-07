import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class UploadService {
  constructor(private firebaseService: FirebaseService) {}
  async upload(file) {
    try {
      const url = await this.firebaseService.upload('todo', file);
      return url;
    } catch (error) {
      throw error;
    }
  }
}
