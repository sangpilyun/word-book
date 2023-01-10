import { BadRequestException, Injectable } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import * as uuid from 'uuid';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateUserCommand } from '../impl/create-user.command';
import { EmailService } from 'src/users/email.service';
import { InjectRepository } from '@nestjs/typeorm';
import { TestEvent } from 'src/users/events/impl/test.event';
import { UserCreatedEvent } from 'src/users/events/impl/user-created.event';

@Injectable()
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly emailService: EmailService,
    private readonly dataSource: DataSource,
    private readonly eventBus: EventBus,
  ) {}
  async execute(command: CreateUserCommand): Promise<any> {
    const { createUserDto } = command;
    const { id } = createUserDto;

    const userExist = await this.checkUserExists(id);
    if (userExist) {
      throw new BadRequestException(`Duplicate entry ${id}`);
    }

    const user = this.userRepository.create(createUserDto);
    user.password = await this.bcryptPassword(user.password);
    user.signUpVerificationToken = uuid.v4();
    await this.saveUserUsingTransaction(user);

    this.eventBus.publish(
      new UserCreatedEvent(user.email, user.signUpVerificationToken),
    );
    this.eventBus.publish(new TestEvent('event-hendler test'));

    return user;
  }

  async checkUserExists(id: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    return user != null;
  }

  async bcryptPassword(password: string): Promise<string> {
    const saltOrRounds = Number(process.env.SALT_OR_ROUNDS);

    return await bcrypt.hash(password, saltOrRounds);
  }

  async saveUserUsingTransaction(user: User): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.save(user);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
