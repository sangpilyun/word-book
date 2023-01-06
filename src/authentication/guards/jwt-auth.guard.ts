import {
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  LoggerService,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../../decorators/public';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    @Inject(Logger)
    private readonly logger: LoggerService,
    private reflector: Reflector,
  ) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Public 데코레이터가 있으면 인증을 거치지 않도록 한다.
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    this.logger.verbose(`jwt-auth.guard canActivate()`, this.constructor.name);
    return super.canActivate(context);
  }
}
