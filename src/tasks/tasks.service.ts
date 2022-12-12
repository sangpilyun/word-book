import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  @Cron(CronExpression.EVERY_MINUTE, { name: 'myJob' })
  handleCron() {
    console.log('Called when the current second is 0');
  }
}
