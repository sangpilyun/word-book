import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ScheduleModule } from '@nestjs/schedule';
import { VocabularyModule } from 'src/vocabulary/vocabulary.module';
@Module({
  imports: [ScheduleModule.forRoot(), VocabularyModule],
  providers: [TasksService],
})
export class TasksModule {}
