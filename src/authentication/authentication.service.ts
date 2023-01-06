import {
  Inject,
  Injectable,
  Logger,
  LoggerService,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from '../dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/entities/user.entity';

@Injectable()
export class AuthenticationService {
  constructor(
    @Inject(Logger)
    private readonly logger: LoggerService,
    private jwtService: JwtService,
    private usersService: UsersService,
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

    const user = await this.usersService.findOneById(id);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }
}
