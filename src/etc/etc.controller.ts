import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TranslateDto } from 'src/dto/Translate.dto';
import { EtcService } from './etc.service';

@Controller('etc')
export class EtcController {
  constructor(private etcService: EtcService) {}

  @UsePipes(ValidationPipe)
  @Post('translate')
  translate(@Body() translateDto: TranslateDto) {
    return this.etcService.translate(translateDto);
  }
}
