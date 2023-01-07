import {
  Injectable,
  BadRequestException,
  Inject,
  Logger,
  LoggerService,
} from '@nestjs/common';
import { CreateMeaningDto } from 'src/dtos/create-meaning.dto';
import { CreateWordDto } from 'src/dtos/create-word.dto';
import { Meaning } from 'src/entities/meaning.entity';
import { Word } from 'src/entities/word.entity';
import { UsersService } from 'src/users/users.service';
import { DataSource } from 'typeorm';

@Injectable()
export class WordService {
  [x: string]: any;
  constructor(
    @Inject(Logger)
    private readonly logger: LoggerService,
    private readonly dataSource: DataSource,
    private readonly usersService: UsersService,
  ) {}

  async findOne(id: number): Promise<Word> {
    const word = await this.dataSource.manager.findOne(Word, {
      where: { id },
      relations: ['meanings'],
    });
    this.logger.debug(
      `DB: word findOne success \n${JSON.stringify(word, null, 2)}`,
      this.constructor.name,
    );

    return word;
  }
  async findOneByName(name: string) {
    const word = await this.dataSource.manager.findOne(Word, {
      where: { name },
      relations: ['meanings'],
    });
    this.logger.debug(
      `DB: word findOneByName success \n${JSON.stringify(word, null, 2)}`,
      this.constructor.name,
    );

    return word;
  }

  async findOneMeaningByMeaing(meaning: string) {
    const meaningEntity = await this.dataSource.manager.findOneBy(Meaning, {
      meaning,
    });
    this.logger.debug(
      `DB: word findOneMeaningByMeaing success 
      \n${JSON.stringify(meaningEntity, null, 2)}`,
      this.constructor.name,
    );

    return meaningEntity;
  }

  async save(createWordDto: CreateWordDto): Promise<Word> {
    this.logger.verbose(
      `DTO: createWordDto
      \n${JSON.stringify(createWordDto, null, 2)}`,
      this.constructor.name,
    );

    const queryRunner = this.dataSource.createQueryRunner();
    let word = new Word();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const { name, pronunciation, sourceUrl } = createWordDto;
      const isFoundWord = await this.findOneByName(name);

      if (!isFoundWord) {
        word.name = name;
        word.pronunciation = pronunciation;
        word.sourceUrl = sourceUrl;

        await queryRunner.manager.save(word);
        this.logger.debug(
          `DB: word save success \n${JSON.stringify(word, null, 2)}`,
          this.constructor.name,
        );
      } else {
        word = isFoundWord;
      }

      const meanings = [];
      for (const meaning of createWordDto.meanings) {
        const isFoundMeaning = await this.findOneMeaningByMeaing(
          meaning.meaning,
        );

        if (isFoundMeaning) {
          continue;
        }

        const newMeaning = new Meaning();
        newMeaning.meaning = meaning.meaning;
        newMeaning.partOfSpeech = meaning.partOfSpeech;
        newMeaning.priority = meaning.priority;
        newMeaning.word = word;
        meanings.push(newMeaning);
      }

      for (const meaning of meanings) {
        await queryRunner.manager.save(meaning);
        this.logger.debug(
          `DB: meaning save success \n${JSON.stringify(meaning, null, 2)}`,
          this.constructor.name,
        );
      }

      word.meanings = meanings;

      await queryRunner.commitTransaction();
    } catch (err) {
      this.logger.error(err.message, err.stack, this.constructor.name);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
      return word;
    }
  }
}
