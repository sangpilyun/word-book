import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateSentenceDto } from 'src/dto/create-sentence.dto';
import { CreateWordDto } from 'src/dto/create-word.dto';
import { SentencesService } from './sentences.service';
import { VocabularyService } from './vocabulary.service';

@Controller('vocabulary')
export class VocabularyController {
  constructor(
    private readonly sentencesService: SentencesService,
    private readonly vocabulariesService: VocabularyService,
  ) {}

  @Post('sentence')
  @UsePipes(ValidationPipe)
  async saveSentence(@Body() createSentenceDto: CreateSentenceDto) {
    return await this.sentencesService.save(createSentenceDto);
  }

  @Post('word')
  @UsePipes(ValidationPipe)
  async saveWord(@Body() createWordDto: CreateWordDto) {
    return await this.vocabulariesService.save(createWordDto);
  }
}
