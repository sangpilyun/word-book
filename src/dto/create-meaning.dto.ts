import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Word } from 'src/entities/word.entity';
import { CreateWordDto } from './create-word.dto';

export class CreateMeaningDto {
  @IsNotEmpty()
  @IsString()
  meaning: string;

  @IsNotEmpty()
  @IsString()
  partOfSpeech: string;

  @IsNotEmpty()
  @IsNumber()
  priority: number;

  word: CreateWordDto;
}
