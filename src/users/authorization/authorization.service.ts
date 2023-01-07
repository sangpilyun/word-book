import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAuthDto } from 'src/dtos/create-auth.dto';
import { UpdateAuthDto } from 'src/dtos/update-auth.dto';
import { Authority } from 'src/entities/authority.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthorizationService {
  constructor(
    @InjectRepository(Authority)
    private readonly authorityRepository: Repository<Authority>,
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
