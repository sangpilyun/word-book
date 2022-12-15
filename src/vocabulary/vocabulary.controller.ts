import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateSentenceDto } from 'src/dto/create-sentence.dto';
import { SentencesService } from './sentences.service';

@Controller('vocabulary')
export class VocabularyController {
  constructor(private readonly sentencesService: SentencesService) {}

  @Post('sentence')
  @UsePipes(ValidationPipe)
  async saveSentence(@Body() createSentenceDto: CreateSentenceDto) {
    return await this.sentencesService.save(createSentenceDto);
  }
}
