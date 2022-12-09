import { IsString, Max } from 'class-validator';
export class CreateAuthDto {
  @IsString()
  @Max(20)
  name: string;
}
