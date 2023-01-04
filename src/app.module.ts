import { Module, Logger } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { typeORMConfig } from './configs/typeorm.config';
import { VocabularyModule } from './vocabulary/vocabulary.module';
import { EtcModule } from './etc/etc.module';
import { TasksModule } from './tasks/tasks.module';
import { InterceptorModule } from './interceptor/interceptor.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'development'
          ? '.env.development'
          : '.env.production',
    }),
    UsersModule,
    AuthenticationModule,
    VocabularyModule,
    EtcModule,
    TasksModule,
    InterceptorModule,
  ],
  controllers: [AppController],
  providers: [AppService, Logger],
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
