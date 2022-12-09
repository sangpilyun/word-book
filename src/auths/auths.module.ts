import { Module } from '@nestjs/common';
import { AuthsService } from './auths.service';
import { AuthsController } from './auths.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Authority } from './entities/authority.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Authority])],
  controllers: [AuthsController],
  providers: [AuthsService],
})
export class AuthsModule {}
