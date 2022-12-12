import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Authority } from './entities/authority.entity';

@Injectable()
export class AuthsService {
  constructor(
    @InjectRepository(Authority)
    private authorityRepository: Repository<Authority>,
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
}
