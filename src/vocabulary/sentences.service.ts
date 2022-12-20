import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSentenceDto } from 'src/dto/create-sentence.dto';
import { UpdateSentenceDto } from 'src/dto/update-sentence.dto';
import { Sentence } from 'src/entities/sentence.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';

@Injectable()
export class SentencesService {
  constructor(
    @InjectRepository(Sentence)
    private readonly sentenceRepository: Repository<Sentence>,
    private readonly usersService: UsersService,
  ) {}
  async save(createSentenceDto: CreateSentenceDto): Promise<Sentence> {
    const user = await this.usersService.findOne(createSentenceDto.userSeq);

    if (!user) {
      throw new Error('sentence save error: user not found');
    }

    const sentence = new Sentence();
    sentence.user = user;
    sentence.sentence = createSentenceDto.sentence;
    sentence.translation = createSentenceDto.translation;
    sentence.translator = createSentenceDto.translator;

    const respose = await this.sentenceRepository.save(sentence);
    return respose;
  }

  async findOne(id: number): Promise<Sentence> {
    return await this.sentenceRepository.findOne({ where: { id } });
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
