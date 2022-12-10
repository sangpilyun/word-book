import { Injectable, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class EtcService {
  constructor(private readonly httpService: HttpService) {}

  async translate(source: string, target: string, text: string) {
    let result = null;
    const papagoUrl = process.env.PAPAGO_API_URL;
    const params = { source, target, text };
    const axiosConfig = {
      headers: {
        'X-Naver-Client-Id': process.env.PAPAGO_CLIENT_ID,
        'X-Naver-Client-Secret': process.env.PAPAGO_CLIENT_SECRET,
      },
    };

    try {
      const respose = await this.httpService.axiosRef.post(
        papagoUrl,
        params,
        axiosConfig,
      );

      const { message, errorCode, errorMessage } = respose.data;
      if (errorCode) {
        throw new BadRequestException('Papago API error: ' + errorMessage);
      }

      result = message.result.translatedText;
    } catch (error) {
      console.log('error: ', error);
      throw new BadRequestException('Papago API error: ' + error.message);
    }

    return result;
  }
}

/** 
 * data:  {
  message: {
    result: {
      srcLangType: 'en',
      tarLangType: 'ko',
      translatedText: '안녕하세요 세계!! 저는 SPY입니다.',
      engineType: 'N2MT',
      pivot: null,
      dict: null,
      tarDict: null
    },
    '@type': 'response',
    '@service': 'naverservice.nmt.proxy',
    '@version': '1.0.0'
  }
 */
/** 
 * data: {
      errorCode: 'N2MT04',
      errorMessage: 'Unsupported target language (지원하지 않는 target 언어입니다.)'
    }
 */
