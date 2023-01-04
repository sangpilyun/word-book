import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meaning } from 'src/entities/meaning.entity';
import { Sentence } from 'src/entities/sentence.entity';
import { Word } from 'src/entities/word.entity';
import { UsersModule } from 'src/users/users.module';
import { SentencesService } from './sentences.service';
import { VocabularyController } from './vocabulary.controller';
import { VocabularyService } from './vocabulary.service';

@Module({
  imports: [TypeOrmModule.forFeature([Sentence, Word, Meaning]), UsersModule],
  controllers: [VocabularyController],
  providers: [VocabularyService, SentencesService, Logger],
  exports: [SentencesService, VocabularyService],
})
export class VocabularyModule {}
