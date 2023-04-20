import { EventBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { DataSource, Repository } from 'typeorm';
import { CreateUserHandler } from './create-user.handler';
import * as uuid from 'uuid';
import { CreateUserCommand } from '../impl/create-user.command';
import { Gender } from 'src/users/common/user.union';
import { UserEntity } from 'src/users/infra/db/entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

jest.mock('uuid');
jest.spyOn(uuid, 'v4').mockReturnValue('test-uuid');

describe('CreateUserHandler', () => {
  let createUserHandler: CreateUserHandler;
  let userRepository: Repository<UserEntity>;
  let eventBus: jest.Mocked<EventBus>;
  let dataSource: DataSource;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [TypeOrmModule.forFeature([UserEntity]),],
      providers: [
        CreateUserHandler,
        {
          provide: 'UserRepository',
          useValue: {
            create: jest.fn().mockResolvedValue({ name: 'testName' }),
            findOne: jest.fn().mockResolvedValue({ name: 'testName' }),
          },
        },
        { provide: EventBus, useValue: { publish: jest.fn() } },
        { provide: DataSource, useValue: { createQueryRunner: jest.fn() } },
      ],
    }).compile();

    createUserHandler = module.get(CreateUserHandler);
    userRepository = module.get('UserRepository');
    eventBus = module.get(EventBus);
    dataSource = module.get(DataSource);
  });

  const gender: Gender = 'F';
  const createUserDto = {
    id: 'testId',
    email: 'testEmail@test.com',
    password: 'testPassword',
    name: 'testName',
    signUpVerificationToken: uuid.v4(),
    gender: gender,
    tel: '010-1234-5678',
    createdDate: null,
    updatedDate: null,
    deletedDate: null,
    authoritys: [],
  };

  describe('execute', () => {
    it('should execute CreateUserCommand', async () => {
      // given
      // createUserHandler.saveUserUsingTransaction = jest.fn();
      const where = { id: createUserDto.id };

      // when
      await createUserHandler.execute(new CreateUserCommand(createUserDto));

      // then
      expect(userRepository.create).toBeCalledWith(createUserDto);
      expect(userRepository.findOne).toBeCalledWith(where);
    });
  });
});
