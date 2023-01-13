import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/infra/db/entity/user.entity';

import { Repository } from 'typeorm';
import { GetUsersInfoQuery } from '../impl/get-users-info.query';

@QueryHandler(GetUsersInfoQuery)
export class GetUsersInfoHandler implements IQueryHandler<GetUsersInfoQuery> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  async execute(query: GetUsersInfoQuery): Promise<UserEntity[]> {
    const users = await this.userRepository.find();

    if (!users) {
      return [];
    }

    return users.map((user) => user);
  }
}
