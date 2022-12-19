import { IsNotEmpty, IsNumber, IsString, Matches } from 'class-validator';
import { CreateMeaningDto } from './create-meaning.dto';

export class CreateWordDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z]+$/, { message: '단어는 영어로만 입력해주세요.' })
  name: string;

  @IsString()
  pronunciation: string;

  @IsString()
  sourceUrl: string;

  @IsNotEmpty()
  meanings: CreateMeaningDto[];

  @IsNumber()
  id: number;
}
