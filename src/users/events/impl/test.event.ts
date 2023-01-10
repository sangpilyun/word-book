import { IEvent } from '@nestjs/cqrs';
import { CqrsEvent } from './cqrs.event';

export class TestEvent extends CqrsEvent implements IEvent {
  constructor(public readonly message: string) {
    super(TestEvent.name);
  }
}
