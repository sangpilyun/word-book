import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sentence } from 'src/entities/sentence.entity';
import { SentencesService } from './sentences.service';
import { VocabularyController } from './vocabulary.controller';
import { VocabularyService } from './vocabulary.service';

@Module({
  imports: [TypeOrmModule.forFeature([Sentence])],
  controllers: [VocabularyController],
  providers: [VocabularyService, SentencesService],
  exports: [SentencesService],
})
export class VocabularyModule {}
