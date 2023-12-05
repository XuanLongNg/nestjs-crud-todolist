import { Injectable } from '@nestjs/common';
import { AppConfigService } from '../configs/app.config.service';
import { ServiceAccount, cert, initializeApp } from 'firebase-admin/app';
import { getDownloadURL, getStorage } from 'firebase-admin/storage';
import { v4 as uuid } from 'uuid';
import { Bucket } from '@google-cloud/storage';
import * as private_key from 'private-key.json';
@Injectable()
export class FirebaseService {
  private bucket: Bucket;
  constructor(private appService: AppConfigService) {
    const config = {
      apiKey: appService.getEnv('FIREBASE_API_KEY'),
      authDomain: appService.getEnv('FIREBASE_AUTH_DOMAIN'),
      projectId: appService.getEnv('FIREBASE_PROJECT_ID'),
      storageBucket: appService.getEnv('FIREBASE_STORAGE_BUCKET'),
      appId: appService.getEnv('FIREBASE_APP_ID'),
      measurementId: appService.getEnv('FIREBASE_MEASUREMENT_ID'),
      messagingSenderId: appService.getEnv('FIREBASE_MESSAGING_SENDER_ID'),
      credential: cert(private_key as ServiceAccount),
    };
    initializeApp(config);
    this.bucket = getStorage().bucket();
  }

  async upload(ref, file) {
    try {
      const bf = Buffer.from(file.buffer);
      const id = uuid();
      const fileExtension = file.originalname.split('.');
      const name = id + '.' + fileExtension[fileExtension.length - 1];
      const fileUpload = this.bucket.file(ref + '/' + name);
      await fileUpload.save(bf, {
        contentType: file.mimetype,
      });
      const url = await getDownloadURL(fileUpload);
      return url;
    } catch (error) {
      throw error;
    }
  }
}
