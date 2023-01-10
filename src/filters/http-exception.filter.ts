import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Inject,
  InternalServerErrorException,
  Logger,
  LoggerService,
} from '@nestjs/common';

/** try/catch로 예외를 잡지 못한 예외를 처리하는 필터 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(Logger)
    private readonly logger: LoggerService,
  ) {}
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();

    /** 알 수 없는 예외는 InternalServerErrorException으로 변환 */
    const isHttpException = exception instanceof HttpException;
    let errorMessage = '';

    if (!isHttpException) {
      errorMessage = ': ' + exception.message;
      exception = new InternalServerErrorException();
    }

    let response = (exception as HttpException).getResponse();
    const status = (exception as HttpException).getStatus();
    const stack = exception.stack;

    const responseType = typeof response;
    switch (responseType) {
      case 'string':
        response += errorMessage;
        break;
      case 'object':
        response['message'] += errorMessage;
        break;
    }

    this.logger.error(response, stack, this.constructor.name);

    res.status(status).json(response);
  }
}
