import { IsNotEmpty, IsString, Max } from 'class-validator';
export class CreateAuthDto {
  @IsNotEmpty()
  @IsString()
  @Max(20)
  name: string;
}
