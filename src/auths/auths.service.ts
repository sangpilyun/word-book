import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Authority } from './entities/authority.entity';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthsService {
  constructor(
    @InjectRepository(Authority)
    private authorityRepository: Repository<Authority>,
    /** 아래 두 서비스에서 종속성 에러 발생중. 보류  */
    // private jwtService: JwtService,
    // private usersService: UsersService,
  ) {}

  async create(createAuthDto: CreateAuthDto) {
    return await this.authorityRepository.save(createAuthDto);
  }

  async findAll() {
    return await this.authorityRepository.find();
  }

  async findOne(id: number) {
    return await this.authorityRepository.findOneBy({ id });
  }
  async findName(name: string) {
    return await this.authorityRepository.findOneBy({ name });
  }

  async update(id: number, updateAuthDto: UpdateAuthDto) {
    return await this.authorityRepository.update(id, updateAuthDto);
  }

  async remove(id: number) {
    return await this.authorityRepository.delete(id);
  }

  // async login(loginUserDto: LoginUserDto): Promise<{ accessToken: string }> {
  //   const { id, password } = loginUserDto;
  //   // const user = await this.usersService.findOneById(id);
  //   const user = { id: 'ff', password: 'fff', seq: 1 };

  //   if (user && (await bcrypt.compare(password, user.password))) {
  //     const payload = { id: user.id, seq: user.seq };
  //     const accessToken = await this.jwtService.sign(payload);

  //     return { accessToken };
  //   } else {
  //     throw new UnauthorizedException('Invalid credentials');
  //   }
  // }

  // async test() {
  //   return await this.usersService.findAll();
  // }
}
