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
import { Public } from 'src/decorators/public';
import { CreateSentenceDto } from 'src/dtos/create-sentence.dto';
import { CreateWordDto } from 'src/dtos/create-word.dto';
import { SentencesService } from './sentences.service';
import { UserWordService } from './user-word.service';
import { WordService } from './word.service';

@Controller('vocabulary')
export class VocabularyController {
  constructor(
    @Inject(Logger)
    private readonly logger: LoggerService,
    private readonly sentencesService: SentencesService,
    private readonly wordService: WordService,
    private readonly userWordService: UserWordService,
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

  @Post('word')
  @UsePipes(ValidationPipe)
  async saveWord(@Body() createWordDto: CreateWordDto) {
    return await this.wordService.save(createWordDto);
  }

  @Get('word/:id')
  async findOneWord(@Param('id') id: number) {
    return await this.wordService.findOne(id);
  }

  @Get('user-word/cardTest')
  async findCardTestWords(
    @Query('userId') userId: number,
    @Query('count') count: number,
  ) {
    return await this.userWordService.findCardTestWords(userId, count);
  }

  @Get('user-word')
  async findAllUserWords(
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('userSeq', ParseIntPipe) userSeq: number,
  ) {
    return await this.userWordService.findAll(userSeq, offset, limit);
  }

  @Public()
  @Get()
  async test() {
    return await this.userWordService.findOne(1, 9);
  }
}
