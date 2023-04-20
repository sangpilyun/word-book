import { Injectable, Type } from '@nestjs/common';
import { EmailService as ExternalEmailService } from 'src/email/email.service';
import { IEmailService } from 'src/users/application/adapter/iemail.service';

@Injectable()
export class EmailService implements IEmailService {
  constructor(private readonly emailService: ExternalEmailService) {}

  async sendMemberJoinVertification(
    email: string,
    signupVerificationToken: string,
  ): Promise<void> {
    this.emailService.sendMemberJoinVertification(
      email,
      signupVerificationToken,
    );
  }
}
