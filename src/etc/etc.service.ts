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
