import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';
import { CreateUserWordDto } from './create-user-word.dto';

export class UpdateUserWordDto extends PartialType(CreateUserWordDto) {
  @IsOptional()
  @IsNumber()
  searchCount: number;

  @IsOptional()
  @IsBoolean()
  test1: boolean;

  @IsOptional()
  @IsBoolean()
  test2: boolean;

  @IsOptional()
  @IsBoolean()
  test3: boolean;

  @IsOptional()
  @IsBoolean()
  test4: boolean;

  @IsOptional()
  @IsBoolean()
  isMemorialized: boolean;
}
