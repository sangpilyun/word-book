import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from '../dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async login(loginUserDto: LoginUserDto): Promise<{ accessToken: string }> {
    const { id, password } = loginUserDto;
    const user = await this.usersService.findOneById(id);
    // const user = { id: 'ff', password: 'fff', seq: 1 };

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { id: user.id, seq: user.seq };
      const accessToken = this.jwtService.sign(payload);

      return { accessToken };
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
