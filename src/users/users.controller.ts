import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import { Public } from 'src/decorators/public';

@UseGuards()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @UsePipes(ValidationPipe)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':seq')
  findOne(@Param('seq') seq: number) {
    return this.usersService.findOne(seq);
  }

  @UsePipes(ValidationPipe)
  @Patch(':seq')
  update(@Param('seq') seq: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(seq, updateUserDto);
  }

  @Delete(':seq')
  remove(@Param('seq') seq: number) {
    return this.usersService.remove(seq);
  }
}
