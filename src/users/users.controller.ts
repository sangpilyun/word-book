import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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

  @Patch(':seq')
  update(@Param('seq') seq: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(seq, updateUserDto);
  }

  @Delete(':seq')
  remove(@Param('seq') seq: number) {
    return this.usersService.remove(seq);
  }
}
