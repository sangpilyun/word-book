import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { typeORMConfig } from './configs/typeorm.config';
import {} from 'dotenv/config';
import * as fs from 'fs';

async function bootstrap() {
  console.log(__dirname);
  console.log(typeORMConfig);
  // https 인증 보류 
  const httpsOptions = {
    key: '',
    cert: '',
  };
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
