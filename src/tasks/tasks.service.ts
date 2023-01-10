import { Injectable, BadRequestException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import puppeteer from 'puppeteer';
import { sleep } from 'src/utils/utils';
import { SentencesService } from 'src/vocabulary/sentences.service';
import { load } from 'cheerio';
import { CreateWordDto } from 'src/dtos/create-word.dto';
import { CreateMeaningDto } from 'src/dtos/create-meaning.dto';
import { WordService } from 'src/vocabulary/word.service';
import { CreateUserWordDto } from 'src/dtos/create-user-word.dto';
import { UserWordService } from 'src/vocabulary/user-word.service';

@Injectable()
export class TasksService {
  private isRunningScraping: boolean;

  constructor(
    private readonly sentencesService: SentencesService,
    private readonly wordService: WordService,
    private readonly userWordService: UserWordService,
  ) {
    this.isRunningScraping = false;
  }

  // @Cron(CronExpression.EVERY_10_SECONDS, { name: 'scrapingNaverEnDictionary' })
  @Cron(CronExpression.EVERY_MINUTE, { name: 'scrapingNaverEnDictionary' })
  async handleCrawlingWord() {
    if (this.isRunningScraping) {
      console.log('이미 실행중입니다.');
      return;
    }

    try {
      /** 단어를 검색하지 않은 문장들 가져오기 */
      const where: object = {
        isSearchForWord: false,
      };
      const sentences = await this.sentencesService.findWhere(where);
      this.isRunningScraping = true;

      /** 문장 각각 크롤링 실행 */
      for (const sentenceObj of sentences) {
        const sentence = sentenceObj.sentence;
        const words = sentence.split(' ');

        // 단어 연결문자 리스트
        const wordConnectorList = ['-', "'", '.'];
        for (const wordConnector of wordConnectorList) {
          for (const i in words) {
            const startReg = new RegExp(`^\\${wordConnector}`);
            const endReg = new RegExp(`\\${wordConnector}$`);
            const word = words[i].replace(startReg, '').replace(endReg, '');
            words[i] = word;
          }
        }

        for (const i in words) {
          const word = words[i];
          const wordReg = new RegExp(
            `[^a-zA-Z\\${wordConnectorList.join('\\')}]`,
            'g',
          );

          words[i] = word.replace(wordReg, '');
        }

        // @TODO 이미 있는 단어 검색카운트 증가시 일부 단어는 증가 안되는 문제 있음
        /** 단어 검색하기 */
        for (const word of words.filter((word) => word.length > 0)) {
          const createUserWordDto = new CreateUserWordDto();
          const isFound = await this.wordService.findOneByName(word);

          if (isFound) {
            console.log('sentenceObj', sentenceObj);
            createUserWordDto.userSeq = sentenceObj.user.seq;
            createUserWordDto.wordId = isFound.id;
            /** 유저 단어장에 추가 */
            const res = await this.userWordService.save(createUserWordDto);

            continue;
          }

          await sleep(1000);
          const createWordDto = await this.scrapingNaverEnDictionary(word);

          if (createWordDto) {
            /** 단어 DB에 저장 */
            const responseWord = await this.wordService.save(createWordDto);

            createUserWordDto.userSeq = sentenceObj.user.seq;
            createUserWordDto.wordId = responseWord.id;
            /** 유저 단어장에 추가 */
            const res = await this.userWordService.save(createUserWordDto);
          }
        }

        /** 문장 DB에 단어 검색 완료 표시 */
        await this.sentencesService.update(sentenceObj.id, {
          isSearchForWord: true,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      this.isRunningScraping = false;
    }

    console.log('크롤링 완료');
  }

  async getHtml(url: string): Promise<string> {
    try {
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();

      await page.goto(url);
      /** _id_mobile_ad 요소가 로딩될때까지 대기. 대기 안해주면 로딩 전에 컨텐츠를 받아와서 크롤링 못할때 있음*/
      await page.waitForSelector('#_id_mobile_ad');
      const html = await page.content();

      await browser.close();
      return html;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Puppeteer error: ' + error);
    }
  }

  async scrapingNaverEnDictionary(word: string): Promise<CreateWordDto> {
    const url = process.env.NAVER_EN_DICTIONARY_URL + word;
    const html = await this.getHtml(url);
    const $ = load(html);

    const isFound = $('#searchPage_entry').length > 0;
    if (!isFound) {
      console.log('not found word: ', word);
      return;
    }

    const [scrapingWord, conjuation] = [
      $(
        '#searchPage_entry > div > div:nth-child(1) > div.origin > a > strong',
      ).text(),
      $(
        '#searchPage_entry > div > div:nth-child(1) > div.origin > span.detail > span > strong',
      ).text(),
    ];

    // 찾고자 하는 단어가 맞는지 확인
    const isSame =
      word.toLowerCase() === scrapingWord.toLowerCase() ||
      word.toLowerCase() === conjuation.toLowerCase();
    if (!isSame) {
      console.log(
        `'${word}' and the search word '${scrapingWord}' are different.`,
      );

      return;
    }

    // 단어 데이터 스크래핑
    const meaingListEl = $(
      '#searchPage_entry > div > div:nth-child(1) > ul > li ',
    );

    const resultWord = new CreateWordDto();
    resultWord.name = scrapingWord;
    resultWord.sourceUrl = url;
    resultWord.meanings = [];
    resultWord.pronunciation = '';

    // listEl
    meaingListEl.each((index, el) => {
      const priority = Number($(el).find('span.num').text().replace('.', ''));
      const partOfSpeech = $(el).find('p > span.word_class').text();
      const meaning = $(el)
        .find('p')
        .each((index, e) => {
          $(e).find('span.word_class').remove();
          $(e).find('span.mark').remove();
        });

      const mean = new CreateMeaningDto();
      mean.priority = priority;
      mean.partOfSpeech = partOfSpeech;
      mean.meaning = meaning.text().trim();

      resultWord.meanings.push(mean);
    });

    // 단어 발음
    const pronunciation = await $(
      '#searchPage_entry > div > div:nth-child(1) > div.listen_global_area._globalSearchPronModule.my_global_pron_area.a > div > div > span.pronounce',
    ).text();
    resultWord.pronunciation = pronunciation;

    //단어의 텀블러 이미지
    const imgSrc = await $(
      '#searchPage_entry > div > div:nth-child(1) > div.thumb_wrap > div > div > a > img',
    ).attr('src');
    // resultWord.img = imgSrc;
    const img = imgSrc;

    console.log(resultWord);

    return resultWord;
    // 유의어 요소
    // #searchPage_thesaurus > h3
  }
}
