import { Injectable, BadRequestException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import puppeteer from 'puppeteer';
import { sleep } from 'src/utils/utils';
import { SentencesService } from 'src/vocabulary/sentences.service';
import { load } from 'cheerio';
import * as fs from 'fs';

@Injectable()
export class TasksService {
  private isRunningScraping: boolean;

  constructor(private readonly sentencesService: SentencesService) {
    this.isRunningScraping = false;
  }

  // @Cron(CronExpression.EVERY_MINUTE, { name: 'scrapingNaverEnDictionary' })
  @Cron(CronExpression.EVERY_10_SECONDS, { name: 'scrapingNaverEnDictionary' })
  async handleCrawlingWord() {
    if (this.isRunningScraping) {
      console.log('이미 실행중입니다.');
      return;
    }

    //puppeteer로 크롤링해서 단어 저장하는 스케줄러

    /** 단어를 검색하지 않은 문장들 가져오기 */
    const where: object = {
      isSearchForWord: false,
    };
    const sentences = await this.sentencesService.findWhere(where);
    console.log(sentences);

    /** 문장을 각각 단어로 분할하기 */
    const splitSentences = sentences.map((sentenceObj) => {
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

      return {
        ...sentenceObj,
        words: words.filter((word) => word.length > 0),
      };
    });
    // console.log(splitSentences);

    /** 단어 검색하기 */
    this.isRunningScraping = true;
    for (const splitSentence of splitSentences) {
      for (const word of splitSentence.words) {
        await sleep(1000);
        await this.scrapingNaverEnDictionary(word);
      }
    }
    this.isRunningScraping = false;
    console.log('크롤링 완료');
  }

  async getHtml(url: string): Promise<string> {
    try {
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();

      await page.goto(url);
      const html = await page.content();

      await browser.close();
      return html;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Puppeteer error: ' + error);
    }
  }

  async scrapingNaverEnDictionary(word: string): Promise<object> {
    const url = process.env.NAVER_EN_DICTIONARY_URL + word;
    const html = await this.getHtml(url);
    const $ = load(html);
    const isFound = $('#searchPage_entry').length > 0;

    // html 변수 내용 html.html 파일로 저장
    fs.writeFile('html.html', html, function (err) {
      if (err) return console.log(err);
      console.log('Hello World > helloworld.txt');
    });

    if (!isFound) {
      console.log('찾기 실패', word);
      return;
    }

    const scrapingWord = await $(
      '#searchPage_entry > div > div:nth-child(1) > div.origin > a > strong',
    ).text();

    const conjuation = $(
      '#searchPage_entry > div > div:nth-child(1) > div.origin > span.detail > span > strong',
    ).text();

    // 찾고자 하는 단어가 맞는지 확인
    const isSame =
      word.toLowerCase() === scrapingWord.toLowerCase() ||
      word.toLowerCase() === conjuation.toLowerCase();
    if (!isSame) {
      console.log('단어가 다름', word, scrapingWord);
      return;
    }

    // 단어 데이터 스크래핑
    const meaingListEl = await $(
      '#searchPage_entry > div > div:nth-child(1) > ul > li ',
    );

    const resultWord = {
      word: scrapingWord,
      meanings: [],
      pronunciation: '',
      img: null,
    };
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

      const mean = {
        priority: priority,
        partOfSpeech: partOfSpeech,
        meaning: meaning.text().trim(),
      };

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
    resultWord.img = imgSrc;

    console.log(resultWord);

    return resultWord;
    // 유의어 요소
    // #searchPage_thesaurus > h3
  }
}
