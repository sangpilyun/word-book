import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/infra/db/entity/user.entity';
import { Repository } from 'typeorm';
import { GetUserInfoQuery } from '../impl/get-user-info.query';

@QueryHandler(GetUserInfoQuery)
export class GetUserInfoHandler implements IQueryHandler<GetUserInfoQuery> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async execute(query: GetUserInfoQuery): Promise<UserEntity> {
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
