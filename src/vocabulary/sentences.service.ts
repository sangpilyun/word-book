import {
  Inject,
  Injectable,
  Logger,
  LoggerService,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSentenceDto } from 'src/dtos/create-sentence.dto';
import { UpdateSentenceDto } from 'src/dtos/update-sentence.dto';
import { Sentence } from 'src/entities/sentence.entity';
import { GetUserInfoQuery } from 'src/users/queries/impl/get-user-info.query';
import { Repository } from 'typeorm';

@Injectable()
export class SentencesService {
  constructor(
    @Inject(Logger)
    private readonly logger: LoggerService,
    @InjectRepository(Sentence)
    private readonly sentenceRepository: Repository<Sentence>,
    private readonly queryBus: QueryBus,
  ) {}
  async save(createSentenceDto: CreateSentenceDto): Promise<Sentence> {
    try {
      const query = new GetUserInfoQuery(createSentenceDto.userSeq);
      const user = await this.queryBus.execute(query);

      if (!user) {
        throw new NotFoundException('sentence save error: user not found');
      }

      const sentence = new Sentence();
      sentence.user = user;
      sentence.sentence = createSentenceDto.sentence;
      sentence.translation = createSentenceDto.translation;
      sentence.translator = createSentenceDto.translator;

      const response = await this.sentenceRepository.save(sentence);
      this.logger.debug(
        `DB: sentence save success \n${JSON.stringify(response, null, 2)}`,
        this.constructor.name,
      );

      return response;
    } catch (error) {
      this.logger.error(error.message, error.stack, this.constructor.name);
      throw new BadRequestException(error);
    }
  }

  async findOne(id: number): Promise<Sentence> {
    const sentence = await this.sentenceRepository.findOne({ where: { id } });
    this.logger.debug(
      `DB: sentence findOne success \n${sentence}`,
      this.constructor.name,
    );

    return sentence;
  }

  async findAll(): Promise<Sentence[]> {
    const sentences = await this.sentenceRepository.find();
    this.logger.debug(
      `DB: sentences findAll success \n${sentences}`,
      this.constructor.name,
    );

    return sentences;
  }

  async findWhere(where: object): Promise<Sentence[]> {
    const sentences = await this.sentenceRepository.find({ where });
    this.logger.debug(
      `DB: sentences findWhere success \n${sentences}`,
      this.constructor.name,
    );
    return sentences;
  }

  async update(
    id: number,
    updateSentenceDto: UpdateSentenceDto,
  ): Promise<object> {
    const response = await this.sentenceRepository.update(
      id,
      updateSentenceDto,
    );

    this.logger.debug(
      `DB: sentence update success \n${JSON.stringify(response, null, 2)}`,
      this.constructor.name,
    );
    return response;
  }

  async delete(id: number): Promise<object> {
    const response = await this.sentenceRepository.delete(id);

    this.logger.debug(
      `DB: sentence delete success \n${JSON.stringify(response, null, 2)}`,
      this.constructor.name,
    );
    return response;
  }
}
