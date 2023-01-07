import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class TranslateDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  source: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  target: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 5000)
  text: string;

  @IsOptional()
  @IsNumber()
  userSeq: number | null;
}
