import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  LoggerService,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { CreateUserWordDto } from 'src/dtos/create-user-word.dto';
import { UpdateUserWordDto } from 'src/dtos/update-user-word.dto';
import { UserWord } from 'src/entities/user-word.entity';
import { Word } from 'src/entities/word.entity';
import { GetUserInfoQuery } from 'src/users/application/query/impl/get-user-info.query';
import { DataSource } from 'typeorm';
import { WordService } from './word.service';

@Injectable()
export class UserWordService {
  constructor(
    @Inject(Logger)
    private readonly logger: LoggerService,
    private readonly dataSource: DataSource,
    private readonly wordService: WordService,
    private readonly queryBus: QueryBus,
  ) {}

  async findAll(userSeq, offset, limit) {
    const words = await this.dataSource.manager.find(UserWord, {
      relations: ['word', 'word.meanings'],
      skip: offset,
      take: limit,
      where: {
        user: { seq: userSeq },
      },
    });
    this.logger.debug(
      `DB: userWord findAll success \n${JSON.stringify(words, null, 2)}`,
      this.constructor.name,
    );
    return words;
  }

  async findOne(userSeq: number, wordId: number) {
    const userWord = await this.dataSource.manager.findOne(UserWord, {
      where: { user: { seq: userSeq }, word: { id: wordId } },
      relations: ['user', 'word'],
    });
    this.logger.debug(
      `DB: userWord findOne success \n${JSON.stringify(userWord, null, 2)}`,
      this.constructor.name,
    );

    return userWord;
  }

  async update(id: number, updateUserWordDto: UpdateUserWordDto) {
    this.logger.verbose(
      `ID: ${id} 
      \nDTO: updateUserWordDto 
      \n${JSON.stringify(updateUserWordDto, null, 2)}`,
      this.constructor.name,
    );

    const userWord = await this.dataSource.manager.update(
      UserWord,
      id,
      updateUserWordDto,
    );
    this.logger.debug(
      `DB: userWord update success \n${JSON.stringify(userWord, null, 2)}`,
      this.constructor.name,
    );

    return userWord;
  }

  async save(createUserWordDto: CreateUserWordDto) {
    this.logger.verbose(
      `DTO: createUserWordDto \n${JSON.stringify(createUserWordDto, null, 2)}`,
      this.constructor.name,
    );

    const query = new GetUserInfoQuery(createUserWordDto.userSeq);
    const user = await this.queryBus.execute(query);
    const word = await this.wordService.findOne(createUserWordDto.wordId);

    try {
      if (!user || !word) {
        throw new BadRequestException(
          'userWord save error: user or word not found',
        );
      }

      const oldUserWord = await this.findOne(user.seq, word.id);
      if (oldUserWord) {
        const updateUserWordDto = new UpdateUserWordDto();
        updateUserWordDto.searchCount = oldUserWord.searchCount + 1;

        const updUW = await this.update(oldUserWord.id, updateUserWordDto);
        return updUW;
      }

      const userWord = new UserWord();
      userWord.user = user;
      userWord.word = word;

      await this.dataSource.manager.save(userWord);
      this.logger.debug(
        `DB: userWord save success \n${JSON.stringify(userWord, null, 2)}`,
        this.constructor.name,
      );

      return userWord;
    } catch (err) {
      this.logger.error(err.message, err.stack, this.constructor.name);
      throw new BadRequestException(err);
    }
  }

  // @@TODO: 카드 테스트에서 사용할 단어를 랜덤으로 가져오는 로직을 구현해야 함
  async findCardTestWords(userId: number, count: number) {
    const days = [0, 1, 3, 6, 29];

    try {
      const words = await this.dataSource.manager.find(Word, {
        relations: ['user_word'],

        // where: { meanings: { isCardTest: true } },
        take: count,
      });
    } catch (error) {
      this.logger.error(error.message, error.stack, this.constructor.name);
      throw new BadRequestException(error);
    }
  }
}
