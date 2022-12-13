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
import { AuthsService } from './auths.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { UsersService } from 'src/users/users.service';

@Controller('auths')
export class AuthsController {
  constructor(
    private readonly authsService: AuthsService,
    // private readonly usersService: UsersService,
  ) {}

  @UsePipes(ValidationPipe)
  @Post()
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authsService.create(createAuthDto);
  }

  @Get()
  findName(@Query() query: any) {
    const name = query.name;

    if (name) {
      return this.authsService.findName(name);
    } else {
      return this.authsService.findAll();
    }
  }
  @Get()
  findAll() {
    return this.authsService.findAll();
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authsService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authsService.remove(+id);
  }

  // @UsePipes(ValidationPipe)
  // @Post('login')
  // async login(
  //   @Body() loginUserDto: LoginUserDto,
  // ): Promise<{ accessToken: string }> {
  //   const user = await this.authsService.login(loginUserDto);
  //   console.log(user);
  //   return user;
  // }

  // @Get('test')
  // async test() {
  //   return await this.authsService.test();
  // }
}
