import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateMeaningDto } from 'src/dto/create-meaning.dto';
import { CreateWordDto } from 'src/dto/create-word.dto';
import { Meaning } from 'src/entities/meaning.entity';
import { Word } from 'src/entities/word.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class VocabularyService {
  constructor(private readonly dataSource: DataSource) {}

  async findOneWordByName(name: string) {
    return await this.dataSource.manager.findOneBy(Word, { name });
  }

  async findOneMeaningByMeaing(meaning: string) {
    return await this.dataSource.manager.findOneBy(Meaning, { meaning });
  }

  async save(createWordDto: CreateWordDto): Promise<CreateWordDto> {
    /** @TODO
     * 병렬로 save 메소드 실행시킬경우, transaction이 안되는 문제가 있음.
     * 왜? rollback을 두번 실행했음
     * 해결방법? save 외부에서 트랜잭션을 설정해서 처리하는 방법이 있을것으로 보임.
     * */
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      let word = new Word();
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
      }

      for (const meaning of meanings) {
        await queryRunner.manager.save(meaning);
      }

      await queryRunner.commitTransaction();

      return createWordDto;
    } catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
