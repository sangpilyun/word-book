import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { getLogFileOption, getFormat } from './configs/winston.config';

const logtype = {
  development: 'debug',
  production: 'info',
  stage: 'verbose',
};

async function bootstrap() {
  // @TODO https 인증 설정
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      format: getFormat(false),
      transports: [
        new winston.transports.Console({
          level: logtype[process.env.NODE_ENV],
          format: getFormat(true),
        }),
        new winston.transports.DailyRotateFile(getLogFileOption()),
        new winston.transports.DailyRotateFile(getLogFileOption('error')),
        new winston.transports.DailyRotateFile(getLogFileOption('info')),
        new winston.transports.DailyRotateFile(getLogFileOption('debug')),
      ],
    }),
  });
  await app.listen(3000);
}
bootstrap();
