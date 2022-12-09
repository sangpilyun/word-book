import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as moment from 'moment';
import { Authority } from 'src/auths/entities/authority.entity';
import { AuthsService } from 'src/auths/auths.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private authService: AuthsService,
    @InjectRepository(Authority)
    private authorityRespository: Repository<Authority>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { id } = createUserDto;
    const isFound = await this.findOneById(id);

    if (isFound) {
      throw new BadRequestException(`Duplicate entry ${id}`);
    }
    const user = this.userRepository.create(createUserDto);
    user.createdDate = user.createdDate ? user.createdDate : moment().toDate();

    await this.userRepository.save(user);
    return user;
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(seq: number): Promise<User> {
    const found = await this.userRepository.findOneBy({ seq });

    if (!found) {
      // throw new NotFoundException(`Can't find Board with by ${seq}`);
    }

    return found;
  }

  async findOneById(id: string): Promise<User> {
    const found = await this.userRepository.findOneBy({ id });

    return found;
  }

  async update(seq: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(seq);
    const set = {};
    for (const key in updateUserDto) {
      set[key] = updateUserDto[key];
      user[key] = updateUserDto[key];
    }

    await this.userRepository.update(seq, set);

    return user;
  }

  async remove(seq: number) {
    return await this.userRepository.delete(seq);
  }

  async savetest() {
    const auths = await this.authService.findAll();
    console.log(auths);
    const user = new User();
    user.id = 'test 200';
    user.password = 'user111';
    user.name = 'user zz';

    user.email = 'zzzz@aver.com';

    user.createdDate = moment().toDate();
    user.authoritys = [...auths];
    const aa = await this.userRepository.save(user);
    console.log('user save test finish ', aa);
    return aa;
  }
}
