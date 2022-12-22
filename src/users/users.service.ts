import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as moment from 'moment';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from '../dto/login-user.dto';
import { AuthorizationService } from './authorization/authorization.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private authorizationService: AuthorizationService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { id } = createUserDto;
    const isFound = await this.findOneById(id);
    const default_auth = process.env.DEFAULT_USER_AUTH;
    const auth = await this.authorizationService.findName(default_auth);

    if (isFound) {
      throw new BadRequestException(`Duplicate entry ${id}`);
    }

    const user = this.userRepository.create(createUserDto);
    user.createdDate = user.createdDate ? user.createdDate : moment().toDate();
    if (auth) {
      user.authorities = [auth];
    }

    // 패스워드 암호화
    const saltOrRounds = Number(process.env.SALT_OR_ROUNDS);
    console.log(saltOrRounds);
    const hash = await bcrypt.hash(user.password, saltOrRounds);
    user.password = hash;

    console.log(user, user.password.length);
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

  async login(loginUserDto: LoginUserDto) {
    const { id, password } = loginUserDto;
    const user = await this.findOneById(id);

    if (user && (await bcrypt.compare(password, user.password))) {
      return 'login success';
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
