import { Body, Controller, Get } from '@nestjs/common';
import { EtcService } from './etc.service';

@Controller('etc')
export class EtcController {
  constructor(private etcService: EtcService) {}

  @Get('translate')
  translate(@Body() body: any) {
    const { source, target, text } = body;

    return this.etcService.translate(source, target, text);
  }
}
