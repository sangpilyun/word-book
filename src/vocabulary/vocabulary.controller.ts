import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Get, Param, Query } from '@nestjs/common/decorators';
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

  @Get('sentence/:id')
  async findOneSentence(@Param('id') id: number) {
    console.log('findOneSentence');
    return await this.sentencesService.findOne(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async saveWord(@Body() createWordDto: CreateWordDto) {
    return await this.vocabulariesService.save(createWordDto);
  }

  @Get('test')
  async test() {
    console.log('test');
    return await this.vocabulariesService.findOneUserWord(1, 9);
  }

  @Get('word/:id')
  async findOneWord(@Param('id') id: number) {
    console.log('findOneWord');
    return await this.vocabulariesService.findOne(id);
  }
}
