import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { AppConfigService } from '../configs/app.config.service';

@Injectable()
export class EmailService {
  private transporter;
  constructor(private configService: AppConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.getEnv('MAIL_ACCOUNT'),
        pass: this.configService.getEnv('MAIL_PASSWD'),
      },
    });
    console.log('Email third party configuration');
  }
  async sendEmail({
    from,
    to,
    subject,
    text,
  }: {
    from: string;
    to: string;
    subject: string;
    text: string;
  }) {
    try {
      const info = await this.transporter.sendMail({
        from: from,
        to: to,
        subject: subject,
        text: text,
      });
      return info;
    } catch (error) {
      console.log(error);

      throw error;
    }
  }
}
