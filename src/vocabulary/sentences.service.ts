import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSentenceDto } from 'src/dto/create-sentence.dto';
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
}
