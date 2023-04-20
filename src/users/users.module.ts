import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Authority } from 'src/entities/authority.entity';
import { AuthorizationModule } from './authorization/authorization.module';
import { CqrsModule } from '@nestjs/cqrs';
import { UsersController } from './interface/users.controller';
import { EmailModule } from 'src/email/email.module';
import { EmailService } from './infra/adapter/email.service';
import { UserEntity } from './infra/db/entity/user.entity';
import { CreateUserHandler } from './application/command/handlers/create-user.handler';
import { UpdateUserHandler } from './application/command/handlers/update-user.handler';
import { DeleteUserHandler } from './application/command/handlers/delete-user.handler';
import { UserCreatedHandler } from './application/event/handlers/user-created.handler';
import { GetUserByIdHandler } from './application/query/handlers/get-user-by-id.handler';
import { GetUserInfoHandler } from './application/query/handlers/get-user-info.handler';
import { GetUsersInfoHandler } from './application/query/handlers/get-users-info.handler';

const commandHandlers = [
  CreateUserHandler,
  UpdateUserHandler,
  DeleteUserHandler,
];

const eventHandlers = [UserCreatedHandler];

const queryHandlers = [
  GetUserInfoHandler,
  GetUserByIdHandler,
  GetUsersInfoHandler,
];
const customProviders = [{ provide: 'EmailService', useClass: EmailService }];

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, Authority]),
    AuthorizationModule,
    CqrsModule,
    EmailModule,
  ],
  controllers: [UsersController],
  providers: [
    Logger,
    ...commandHandlers,
    ...eventHandlers,
    ...queryHandlers,
    ...customProviders,
  ],
  exports: [],
})
export class UsersModule {}
