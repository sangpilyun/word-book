import { Injectable } from '@nestjs/common';
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';

export interface Dog {
  name: string;
  type: string;
}

/** 커스텀 연습용
 *  this.getStatus(key, isHealthy, data): 상태값을 반환하는 함수
 *  key: 상태값의 이름
 *  isHealthy: 상태값
 *  data: 결과에 추가할 데이터
 */
@Injectable()
export class DogHealthIndicator extends HealthIndicator {
  private dogs: Dog[] = [
    { name: 'Fido', type: 'Poodle' },
    { name: 'Rex', type: 'Dalmatian' },
    { name: 'Spot', type: 'Badboy' },
  ];

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    console.log('key: ', key);
    const badboys = this.dogs.filter((dog) => dog.type === 'Badboy');
    const isHealthy = badboys.length === 0;
    const result = this.getStatus(key, isHealthy, { badboys: badboys.length });

    if (isHealthy) {
      return result;
    }

    throw new HealthCheckError('DogCheck fail', result);
  }
}
