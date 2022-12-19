import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meaning } from 'src/entities/meaning.entity';
import { Sentence } from 'src/entities/sentence.entity';
import { Word } from 'src/entities/word.entity';
import { SentencesService } from './sentences.service';
import { VocabularyController } from './vocabulary.controller';
import { VocabularyService } from './vocabulary.service';

@Module({
  imports: [TypeOrmModule.forFeature([Sentence, Word, Meaning])],
  controllers: [VocabularyController],
  providers: [VocabularyService, SentencesService],
  exports: [SentencesService, VocabularyService],
})
export class VocabularyModule {}
