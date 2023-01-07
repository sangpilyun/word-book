import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { LoginUserDto } from '../dtos/login-user.dto';
import { UsersService } from 'src/users/users.service';
import { Public } from 'src/decorators/public';
import { LocalAuthGuard } from './guards/local.auth.guard';

@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly authsService: AuthenticationService,
    private readonly userService: UsersService,
  ) {}

  // @UseGuards(AuthGuard('local')) 보다는 아래와 같이 사용하는 것이 좋다.
  // 위처럼 전략이름을 직접 전달하면 코드베이스에 매직 문자열이 도입되기 때문
  @Public()
  @UseGuards(LocalAuthGuard)
  @UsePipes(ValidationPipe)
  @Post('login')
  async login(
    @Body() loginUserDto: LoginUserDto,
  ): Promise<{ accessToken: string }> {
    const { id } = loginUserDto;
    const user = await this.userService.findOneById(id);
    const token = await this.authsService.login(user);
    return token;
  }

  @Public()
  @Get('verify-email')
  verifyEmail(@Query('token') token: string) {
    // @@TODO: verify email 구현
    console.log(token);
  }

  @Get('profile')
  getProfile(@Query('id') id: string) {
    return this.userService.findOneById(id);
  }
}
