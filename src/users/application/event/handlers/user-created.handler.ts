import { Inject, Injectable } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserCreatedEvent } from '../../../domain/user-created.event';
import { IEmailService } from '../../adapter/iemail.service';

@Injectable()
@EventsHandler(UserCreatedEvent)
export class UserCreatedHandler implements IEventHandler<UserCreatedEvent> {
  constructor(
    @Inject('EmailService')
    private readonly emailService: IEmailService,
  ) {}

  async handle(event: UserCreatedEvent) {
    switch (event.name) {
      case UserCreatedEvent.name:
        const { email, signupVerificationToken } = event as UserCreatedEvent;
        await this.emailService.sendMemberJoinVertification(
          email,
          signupVerificationToken,
        );
        break;
      default:
        break;
    }
  }
}
