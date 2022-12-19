import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSentenceDto } from 'src/dto/create-sentence.dto';
import { UpdateSentenceDto } from 'src/dto/update-sentence.dto';
import { Sentence } from 'src/entities/sentence.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SentencesService {
  constructor(
    @InjectRepository(Sentence)
    private readonly sentenceRepository: Repository<Sentence>,
  ) {}
  async save(createSentenceDto: CreateSentenceDto): Promise<Sentence> {
    const respose = await this.sentenceRepository.save(createSentenceDto);
    return respose;
  }

  async findAll(): Promise<Sentence[]> {
    return await this.sentenceRepository.find();
  }

  async findWhere(where: object): Promise<Sentence[]> {
    return await this.sentenceRepository.findBy(where);
  }

  async update(
    id: number,
    updateSentenceDto: UpdateSentenceDto,
  ): Promise<object> {
    const response = await this.sentenceRepository.update(
      id,
      updateSentenceDto,
    );

    console.log(response);
    return response;
  }

  async temp() {
    const where: object = {
      isSearchForWord: false,
    };
    const response = await this.findWhere(where);

    return where;
  }
}
