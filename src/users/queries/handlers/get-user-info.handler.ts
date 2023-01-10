import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { GetUserInfoQuery } from '../impl/get-user-info.query';

@QueryHandler(GetUserInfoQuery)
export class GetUserInfoHandler implements IQueryHandler<GetUserInfoQuery> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(query: GetUserInfoQuery): Promise<User> {
    const { seq } = query;

    const user = await this.userRepository.findOne({
      where: { seq },
    });

    if (!user) {
      throw new NotFoundException(`User with sequence ${seq} not found.`);
    }

    return user;
  }
}
