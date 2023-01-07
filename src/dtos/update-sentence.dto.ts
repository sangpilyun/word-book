import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean } from 'class-validator';
import { CreateSentenceDto } from './create-sentence.dto';

export class UpdateSentenceDto extends PartialType(CreateSentenceDto) {
  @IsBoolean()
  isSearchForWord: boolean;
}
