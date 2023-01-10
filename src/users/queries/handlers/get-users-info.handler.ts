import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { GetUsersInfoQuery } from '../impl/get-users-info.query';

@QueryHandler(GetUsersInfoQuery)
export class GetUsersInfoHandler implements IQueryHandler<GetUsersInfoQuery> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async execute(query: GetUsersInfoQuery): Promise<User[]> {
    const users = await this.userRepository.find();

    if (!users) {
      return [];
    }

    return users.map((user) => user);
  }
}
