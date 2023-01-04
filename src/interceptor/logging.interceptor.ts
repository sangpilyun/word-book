import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Logger,
  LoggerService,
  Inject,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    @Inject(Logger)
    private readonly logger: LoggerService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const { method, url, body } = context.getArgByIndex(0);
    const className = context.getClass().name;

    this.logger.verbose(
      `Request from ${method} ${url} ${JSON.stringify(body)}`,
      className,
    );

    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap((data) =>
          this.logger.verbose(
            `Response from ${method} ${url} \n response: ${JSON.stringify(
              data,
            )} \n time: ${Date.now() - now}ms`,
            className,
          ),
        ),
      );
  }
}
