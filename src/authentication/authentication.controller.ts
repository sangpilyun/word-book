import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { LoginUserDto } from '../dto/login-user.dto';

@Controller('auths')
export class AuthenticationController {
  constructor(private readonly authsService: AuthenticationService) {}

  @UsePipes(ValidationPipe)
  @Post('login')
  async login(
    @Body() loginUserDto: LoginUserDto,
  ): Promise<{ accessToken: string }> {
    const user = await this.authsService.login(loginUserDto);
    console.log(user);
    return user;
  }

  // @Get('test')
  // async test() {
  //   return await this.authsService.test();
  // }
}
