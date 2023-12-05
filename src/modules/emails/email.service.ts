import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { AppConfigService } from '../configs/app.config.service';
import { Cron, CronExpression } from '@nestjs/schedule';

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
    } catch (error) {}
  }

  // @Cron(CronExpression.EVERY_30_SECONDS)
  async sendAnnouncement() {
    try {
      const info = {
        from: this.configService.getEnv('MAIL_ACCOUNT'),
        to: 'ngxuanlong2k2@gmail.com',
        subject: 'Hello world!',
        text: 'This is the testing email',
      };
      console.log('Sent mail every 30s');

      await this.sendEmail(info);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
