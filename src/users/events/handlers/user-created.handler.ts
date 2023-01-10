import { Injectable } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EmailService } from 'src/users/email.service';
import { TestEvent } from '../impl/test.event';
import { UserCreatedEvent } from '../impl/user-created.event';

@Injectable()
@EventsHandler(UserCreatedEvent, TestEvent)
export class UserCreatedHandler
  implements IEventHandler<UserCreatedEvent | TestEvent>
{
  constructor(private readonly emailService: EmailService) {}

  async handle(event: UserCreatedEvent | TestEvent) {
    switch (event.name) {
      case UserCreatedEvent.name:
        const { email, signupVerificationToken } = event as UserCreatedEvent;
        await this.emailService.sendMemberJoinVertification(
          email,
          signupVerificationToken,
        );
        break;
      case TestEvent.name:
        const { message } = event as TestEvent;
        console.log('TestEvent', message);
        break;
      default:
        break;
    }
  }
}
