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
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { Public } from 'src/decorators/public';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from './commands/impl/create-user.command';
import { GetUsersInfoQuery } from './queries/impl/get-users-info.query';
import { GetUserInfoQuery } from './queries/impl/get-user-info.query';
import { DeleteUserCommand } from './commands/impl/delete-user.command';
import { UpdateUserCommand } from './commands/impl/update-user.command';

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
