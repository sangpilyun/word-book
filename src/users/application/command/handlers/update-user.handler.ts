import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/infra/db/entity/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserCommand } from '../impl/update-user.command';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async execute(command: UpdateUserCommand): Promise<any> {
    const { seq, updateUserDto } = command;
    const set = {};

    for (const key in updateUserDto) {
      set[key] = updateUserDto[key];
    }

    await this.userRepository.update(seq, set);

    return await this.userRepository.findOne({
      where: { seq },
    });
  }
}
