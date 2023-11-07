import { Injectable } from '@nestjs/common';
import { AppConfigService } from '../configs/app.config.service';
import { ServiceAccount, cert, initializeApp } from 'firebase-admin/app';
import { getDownloadURL, getStorage } from 'firebase-admin/storage';
import { v4 as uuid } from 'uuid';
import { Bucket } from '@google-cloud/storage';
@Injectable()
export class FirebaseService {
  private bucket: Bucket;
  constructor(private appService: AppConfigService) {
    const privateKey = {
      type: appService.getEnv('FIREBASE_TYPE'),
      project_id: appService.getEnv('FIREBASE_PROJECT_ID'),
      private_key_id: appService.getEnv('FIREBASE_PRIVATE_KEY_ID'),
      private_key: appService.getEnv('FIREBASE_PRIVATE_KEY'),
      client_email: appService.getEnv('FIREBASE_CLIENT_EMAIL'),
      client_id: appService.getEnv('FIREBASE_CLIENT_ID'),
      auth_uri: appService.getEnv('FIREBASE_AUTH_URI'),
      token_uri: appService.getEnv('FIREBASE_TOKEN_URI'),
      auth_provider_x509_cert_url: appService.getEnv('FIREBASE_AUTH_PROVIDER'),
      client_x509_cert_url: appService.getEnv('FIREBASE_CLIENT_CERT_URL'),
      universe_domain: appService.getEnv('FIREBASE_UNIVERSE_DOMAIN'),
    };
    const config = {
      apiKey: appService.getEnv('FIREBASE_API_KEY'),
      authDomain: appService.getEnv('FIREBASE_AUTH_DOMAIN'),
      projectId: appService.getEnv('FIREBASE_PROJECT_ID'),
      storageBucket: appService.getEnv('FIREBASE_STORAGE_BUCKET'),
      appId: appService.getEnv('FIREBASE_APP_ID'),
      measurementId: appService.getEnv('FIREBASE_MEASUREMENT_ID'),
      messagingSenderId: appService.getEnv('FIREBASE_MESSAGING_SENDER_ID'),
      credential: cert(privateKey as ServiceAccount),
    };
    initializeApp(config);
    this.bucket = getStorage().bucket();
    console.log('Firebase connected');
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
