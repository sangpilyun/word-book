import { Module } from '@nestjs/common';
import { EtcController } from './etc.controller';
import { EtcService } from './etc.service';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sentence } from 'src/entities/sentence.entity';
import { VocabularyModule } from 'src/vocabulary/vocabulary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sentence]),
    HttpModule.register({ timeout: 5 * 1000, maxRedirects: 5 }),
    VocabularyModule,
  ],
  controllers: [EtcController],
  providers: [EtcService],
})
export class EtcModule {}
