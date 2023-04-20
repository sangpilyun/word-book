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
  Inject,
  Logger,
  LoggerService,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Public } from 'src/decorators/public';
import { CreateUserCommand } from '../application/command/impl/create-user.command';
import { DeleteUserCommand } from '../application/command/impl/delete-user.command';
import { UpdateUserCommand } from '../application/command/impl/update-user.command';
import { GetUserInfoQuery } from '../application/query/impl/get-user-info.query';
import { GetUsersInfoQuery } from '../application/query/impl/get-users-info.query';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(
    @Inject(Logger)
    private readonly logger: LoggerService,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Public()
  @UsePipes(ValidationPipe)
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const command = new CreateUserCommand(createUserDto);

    return this.commandBus.execute(command);
  }

  @Get()
  async findAll() {
    const query = new GetUsersInfoQuery();

    return this.queryBus.execute(query);
  }

  @Get(':seq')
  async findOne(@Param('seq') seq: number) {
    const query = new GetUserInfoQuery(seq);

    return this.queryBus.execute(query);
  }

  @UsePipes(ValidationPipe)
  @Patch(':seq')
  async update(
    @Param('seq') seq: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const command = new UpdateUserCommand(seq, updateUserDto);

    return this.commandBus.execute(command);
  }

  @Delete(':seq')
  async remove(@Param('seq') seq: number) {
    const command = new DeleteUserCommand(seq);

    return this.commandBus.execute(command);
  }
}
