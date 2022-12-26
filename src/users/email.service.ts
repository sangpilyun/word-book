import { Injectable } from '@nestjs/common';
import Mail from 'nodemailer/lib/mailer';
import * as nodemailer from 'nodemailer';

interface EmailOptions {
  to: string; // email address
  subject: string; // email subject
  html: string; // email body
}

@Injectable()
export class EmailService {
  private transporter: Mail;
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_SERVER,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  // @@TODO: 상용 메일서비스 모듈로 변경
  async sendMemberJoinVertification(
    emailAddress: string,
    vertificationToken: string,
  ) {
    const baseUrl = process.env.MAIL_BASE_URL;
    const url = `${baseUrl}/auth/verify-email?token=${vertificationToken}`;

    const options: EmailOptions = {
      to: emailAddress,
      subject: 'Welcome to NestJS 가입인증 메일',
      html: `가입 확인 버튼을 누르시면 가입인증이 완료됩니다. 
      <a href="${url}">가입 확인</a>`,
    };

    return await this.transporter.sendMail(options);
  }
}
