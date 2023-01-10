import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserCommand } from '../impl/update-user.command';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
