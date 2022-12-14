import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { AuthsService } from 'src/auths/auths.service';
import { Authority } from 'src/entities/authority.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Authority])],
  controllers: [UsersController],
  providers: [UsersService, AuthsService],
  exports: [UsersService],
})
export class UsersModule {}
