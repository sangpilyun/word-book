import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateSentenceDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  sentence: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  translation: string;

  @IsString()
  @Length(1, 20)
  translator: string;
}
