import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/infra/db/entity/user.entity';
import { Repository } from 'typeorm';
import { GetUserByIdQuery } from '../impl/get-user-info-by-id.query';

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdHandler implements IQueryHandler<GetUserByIdQuery> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async execute(query: GetUserByIdQuery): Promise<UserEntity> {
    const { id } = query;
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found: ' + id);
    }

    // @@TODO: password 같은 중요한 정보는 제거해야 함 -> 어떤방식으로 제거할지 고민해보기
    return user;
  }
}
