import {
  Inject,
  Injectable,
  Logger,
  LoggerService,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthenticationService } from '../authentication.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(Logger)
    private readonly logger: LoggerService,
    private authenticationService: AuthenticationService,
  ) {
    super({ usernameField: 'id' });
  }

  async validate(id: string, password: string): Promise<any> {
    this.logger.verbose(`validate: ${id}`, this.constructor.name);

    const user = await this.authenticationService.validateUser(id, password);
    if (!user) {
      this.logger.verbose(`validate fail: ${id}`, this.constructor.name);
      throw new UnauthorizedException();
    }

    this.logger.verbose(
      `validate success: ${JSON.stringify(user)}`,
      this.constructor.name,
    );
    return user;
  }
}
