import { Logger, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Authority } from 'src/entities/authority.entity';
import { AuthorizationModule } from './authorization/authorization.module';
import { EmailService } from './email.service';
import { CqrsModule } from '@nestjs/cqrs';
import { commandHandlers } from './commands/handlers';
import { eventHandlers } from './events/handlers';
import { queryHandlers } from './queries/handlers';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Authority]),
    AuthorizationModule,
    CqrsModule,
  ],
  controllers: [UsersController],
  providers: [
    EmailService,
    Logger,
    ...commandHandlers,
    ...eventHandlers,
    ...queryHandlers,
  ],
  exports: [],
})
export class UsersModule {}
