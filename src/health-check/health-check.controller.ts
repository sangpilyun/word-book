import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { Public } from 'src/decorators/public';
import { DogHealthIndicator } from './Indicators/custom-dog.indicator';

@Public()
@Controller('health-check')
export default class HealthCheckController {
  constructor(
    private readonly healthService: HealthCheckService,
    private readonly db: TypeOrmHealthIndicator,
    private readonly http: HttpHealthIndicator,
    private readonly customTest: DogHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.healthService.check([
      () => this.db.pingCheck('database'),
      // () => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
      // () => this.customTest.isHealthy('dogs'),
    ]);
  }
}
