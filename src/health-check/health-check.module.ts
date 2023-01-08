import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import HealthCheckController from './health-check.controller';
import { DogHealthIndicator } from './Indicators/custom-dog.indicator';

@Module({
  imports: [TerminusModule.forRoot(), HttpModule],
  controllers: [HealthCheckController],
  providers: [DogHealthIndicator],
})
export class HealthCheckModule {}
