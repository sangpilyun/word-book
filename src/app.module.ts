import { Module, Logger } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { getTypeOrmConfig } from './configs/typeorm.config';
import { VocabularyModule } from './vocabulary/vocabulary.module';
import { EtcModule } from './etc/etc.module';
import { TasksModule } from './tasks/tasks.module';
import { InterceptorModule } from './interceptor/interceptor.module';
import { HttpModule } from '@nestjs/axios';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { HealthCheckModule } from './health-check/health-check.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'development'
          ? '.env.development'
          : '.env.production',
    }),
    TypeOrmModule.forRoot(getTypeOrmConfig()),
    UsersModule,
    AuthenticationModule,
    VocabularyModule,
    EtcModule,
    TasksModule,
    InterceptorModule,
    HttpModule.register({ timeout: 5 * 1000, maxRedirects: 5 }),
    HealthCheckModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    Logger,
    { provide: APP_FILTER, useClass: HttpExceptionFilter }, // 글로벌 필터 등록
  ],
})
export class AppModule {}

// 특정모듈에 미들웨어 적용
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer): any {
//     consumer
//       .apply(LoggerMiddleware, LoggerMiddleware2)
//       .exclude({ path: '/', method: RequestMethod.GET })
//       .forRoutes(AppController);
//   }
// }
