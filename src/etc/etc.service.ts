import { Injectable, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Sentence } from 'src/entities/sentence.entity';
import { DataSource, Repository } from 'typeorm';
import { SentencesService } from 'src/vocabulary/sentences.service';
import { TranslateDto } from 'src/dtos/Translate.dto';

@Injectable()
export class EtcService {
  constructor(
    @InjectRepository(Sentence)
    private readonly sentenceRepository: Repository<Sentence>,
    private readonly httpService: HttpService,
    private readonly sentencesService: SentencesService,
    private readonly dataSource: DataSource,
  ) {}

  async translate(translateDto: TranslateDto): Promise<string> {
    const queryRunner = this.dataSource.createQueryRunner();
    const { source, target, userSeq } = translateDto;
    let { text } = translateDto;
    const translatedSentences = [];

    //텍스트 문장별로 나누기
    const endMarks = ['.', '?', '!'];
    endMarks.forEach((mark) => {
      text = text.replace(mark + ' ', mark + '\n');
    });
    const sentences = text
      .split('\n')
      .map((sentence) => sentence.trim())
      .filter((sentence) => sentence.length > 0);

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const sentence of sentences) {
        //요청 데이터 설정
        const papagoUrl: string = process.env.PAPAGO_API_URL;
        const params: object = { source, target, text: sentence };
        const axiosConfig: object = {
          headers: {
            'X-Naver-Client-Id': process.env.PAPAGO_CLIENT_ID,
            'X-Naver-Client-Secret': process.env.PAPAGO_CLIENT_SECRET,
          },
        };

        // Papago API 요청
        const respose = await this.httpService.axiosRef.post(
          papagoUrl,
          params,
          axiosConfig,
        );

        const { message, errorCode, errorMessage } = respose.data;
        if (errorCode) {
          await queryRunner.rollbackTransaction();
          throw new BadRequestException('Papago API error: ' + errorMessage);
        }

        const translatedSentence = message.result.translatedText;
        translatedSentences.push(translatedSentence);

        // 로그인한 사용자일 경우 DB에 저장
        if (userSeq) {
          await this.sentencesService.save({
            sentence: sentence,
            translation: translatedSentence,
            translator: 'papago',
            userSeq: userSeq,
          });
        }
      }

      // 트랜잭션 커밋
      await queryRunner.commitTransaction();
    } catch (error) {
      console.log('error: ', error);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Papago API error: ' + error.message);
    } finally {
      await queryRunner.release();
    }

    return translatedSentences.join('\n');
  }
}
