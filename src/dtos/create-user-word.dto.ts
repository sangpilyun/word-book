import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateUserWordDto {
  @IsNotEmpty()
  @IsNumber()
  wordId: number;

  @IsNotEmpty()
  @IsNumber()
  userSeq: number;
}
