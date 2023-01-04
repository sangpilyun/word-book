import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateMeaningDto } from 'src/dto/create-meaning.dto';
import { CreateUserWordDto } from 'src/dto/create-user-word.dto';
import { CreateWordDto } from 'src/dto/create-word.dto';
import { UpdateUserWordDto } from 'src/dto/update-user-word.dto';
import { Meaning } from 'src/entities/meaning.entity';
import { UserWord } from 'src/entities/user-word.entity';
import { Word } from 'src/entities/word.entity';
import { UsersService } from 'src/users/users.service';
import { DataSource } from 'typeorm';

@Injectable()
export class VocabularyService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly usersService: UsersService,
  ) {}

  async findAllWords(userSeq, offset, limit) {
    return await this.dataSource.manager.find(UserWord, {
      relations: ['word', 'word.meanings'],
      skip: offset,
      take: limit,
      where: {
        user: { seq: userSeq },
      },
    });
  }
  async findCardTestWords(userId: number, count: number) {
    const days = [0, 1, 3, 6, 29];
    const queryRunner = this.dataSource.createQueryRunner();

    queryRunner.connect();
    queryRunner.startTransaction();
    try {
      const words = await queryRunner.manager.find(Word, {
        relations: ['user_word'],

        // where: { meanings: { isCardTest: true } },
        take: count,
      });
    } catch (error) {}
  }

  async findOneUserWord(userSeq: number, wordId: number) {
    return await this.dataSource.manager.findOne(UserWord, {
      where: { user: { seq: userSeq }, word: { id: wordId } },
      relations: ['user', 'word'],
    });
  }
  async saveUserWord(createUserWordDto: CreateUserWordDto) {
    const user = await this.usersService.findOne(createUserWordDto.userId);
    const word = await this.findOne(createUserWordDto.wordId);

    if (!user) {
      throw new BadRequestException('userWord save error: user not found');
    }

    if (!word) {
      throw new BadRequestException('userWord save error: word not found');
    }

    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const oldUserWord = await this.findOneUserWord(user.seq, word.id);
      if (oldUserWord) {
        const updateUserWordDto = new UpdateUserWordDto();
        updateUserWordDto.searchCount = oldUserWord.searchCount + 1;

        console.log(updateUserWordDto, 'updateUserWordDto');
        const a = await this.updateUserWord(oldUserWord.id, updateUserWordDto);
        console.log(oldUserWord, '이미 있는 단어 카운트 추가');
        return a;
      }

      const userWord = new UserWord();
      userWord.user = user;
      userWord.word = word;
      console.log(oldUserWord, 'isUserWord');

      await queryRunner.manager.save(userWord);
      await queryRunner.commitTransaction();

      return userWord;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(err);
    } finally {
      await queryRunner.release();
    }
  }

  async updateUserWord(id: number, updateUserWordDto: UpdateUserWordDto) {
    return await this.dataSource.manager.update(
      UserWord,
      id,
      updateUserWordDto,
    );
  }
  async findOne(id: number): Promise<Word> {
    return await this.dataSource.manager.findOne(Word, {
      where: { id },
      relations: ['meanings'],
    });
  }
  async findOneWordByName(name: string) {
    return await this.dataSource.manager.findOne(Word, {
      where: { name },
      relations: ['meanings'],
    });
  }

  async findOneMeaningByMeaing(meaning: string) {
    return await this.dataSource.manager.findOneBy(Meaning, { meaning });
  }

  async save(createWordDto: CreateWordDto): Promise<Word> {
    const queryRunner = this.dataSource.createQueryRunner();
    let word = new Word();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const { name, pronunciation, sourceUrl } = createWordDto;
      const isFoundWord = await this.findOneWordByName(name);
      if (!isFoundWord) {
        word.name = name;
        word.pronunciation = pronunciation;
        word.sourceUrl = sourceUrl;

        await queryRunner.manager.save(word);
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
        console.log(newMeaning, 'newMeaning');
      }

      for (const meaning of meanings) {
        await queryRunner.manager.save(meaning);
      }

      word.meanings = meanings;

      await queryRunner.commitTransaction();
    } catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
      return word;
    }
  }
}
