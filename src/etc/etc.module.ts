import { Module } from '@nestjs/common';
import { EtcController } from './etc.controller';
import { EtcService } from './etc.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule.register({ timeout: 5 * 1000, maxRedirects: 5 })],
  controllers: [EtcController],
  providers: [EtcService],
})
export class EtcModule {}
