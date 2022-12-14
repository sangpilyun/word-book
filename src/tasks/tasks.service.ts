import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  @Cron(CronExpression.EVERY_MINUTE, { name: 'myJob' })
  handleCrawlingWord() {
    console.log('저장된 문장을 각 단어로 나눠 크롤링해서 뜻 저장하는 스케줄러');
  }
}
