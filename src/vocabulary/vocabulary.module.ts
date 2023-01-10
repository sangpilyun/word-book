import { Logger, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meaning } from 'src/entities/meaning.entity';
import { Sentence } from 'src/entities/sentence.entity';
import { Word } from 'src/entities/word.entity';
import { UsersModule } from 'src/users/users.module';
import { SentencesService } from './sentences.service';
import { UserWordService } from './user-word.service';
import { VocabularyController } from './vocabulary.controller';
import { WordService } from './word.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sentence, Word, Meaning]),
    UsersModule,
    CqrsModule,
  ],
  controllers: [VocabularyController],
  providers: [WordService, UserWordService, SentencesService, Logger],
  exports: [SentencesService, WordService, UserWordService],
})
export class VocabularyModule {}
