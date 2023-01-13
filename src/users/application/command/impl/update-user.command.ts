import { ICommand } from '@nestjs/cqrs';
import { UpdateUserDto } from 'src/users/interface/dto/update-user.dto';

export class UpdateUserCommand implements ICommand {
  constructor(
    public readonly seq: number,
    public readonly updateUserDto: UpdateUserDto,
  ) {}
}
