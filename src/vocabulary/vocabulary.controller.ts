import {
  Body,
  Controller,
  DefaultValuePipe,
  Logger,
  LoggerService,
  ParseIntPipe,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Get, Inject, Param, Query } from '@nestjs/common/decorators';
import { CreateSentenceDto } from 'src/dto/create-sentence.dto';
import { CreateWordDto } from 'src/dto/create-word.dto';
import { SentencesService } from './sentences.service';
import { VocabularyService } from './vocabulary.service';

@Controller('vocabulary')
export class VocabularyController {
  constructor(
    @Inject(Logger)
    private readonly logger: LoggerService,
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
    return await this.sentencesService.findOne(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async saveWord(@Body() createWordDto: CreateWordDto) {
    return await this.vocabulariesService.save(createWordDto);
  }

  @Get()
  async test() {
    this.logger.log('type log');
    return await this.vocabulariesService.findOneUserWord(1, 9);
  }

  @Get('word/:id')
  async findOneWord(@Param('id') id: number) {
    return await this.vocabulariesService.findOne(id);
  }

  @Get('word/cardTest')
  async findCardTestWords(
    @Query('userId') userId: number,
    @Query('count') count: number,
  ) {
    return await this.vocabulariesService.findCardTestWords(userId, count);
  }

  @Get('word')
  async findAllWords(
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('userSeq', ParseIntPipe) userSeq: number,
  ) {
    return await this.vocabulariesService.findAllWords(userSeq, offset, limit);
  }
}
