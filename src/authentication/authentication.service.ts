import {
  Inject,
  Injectable,
  Logger,
  LoggerService,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from '../dtos/login-user.dto';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entities/user.entity';
import { QueryBus } from '@nestjs/cqrs';
import { GetUserByIdQuery } from 'src/users/queries/impl/get-user-info-by-id.query';

@Injectable()
export class AuthenticationService {
  constructor(
    @Inject(Logger)
    private readonly logger: LoggerService,
    private readonly jwtService: JwtService,
    private readonly queryBus: QueryBus,
  ) {}

  async login(user: User): Promise<any> {
    const { id, email } = user;
    const payload = { id: user.id, name: user.name };
    const token = { access_token: this.jwtService.sign(payload) };

    this.logger.log(`login id: ${id}, email: ${email}`, this.constructor.name);
    return token;
  }

  async validateUser(id: string, password: string): Promise<any> {
    this.logger.verbose(`validateUser: ${id}`, this.constructor.name);

    const query = new GetUserByIdQuery(id);
    const user = await this.queryBus.execute(query);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }
}
