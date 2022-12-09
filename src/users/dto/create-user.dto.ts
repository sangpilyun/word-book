import { Gender } from '../entities/user.entity';
import { Max, Length, IsEmail, IsString, IsDate } from 'class-validator';
import { Authority } from 'src/auths/entities/authority.entity';

export class CreateUserDto {
  @IsString()
  @Length(4, 16)
  id: string;

  @IsString()
  @Length(8, 20)
  password: string;

  @IsString()
  @Length(8, 20)
  name: string;

  @IsEmail()
  @Max(45)
  email: string;

  @IsString()
  @Length(1, 1)
  gender: Gender;

  @IsString()
  tel: string;

  @IsDate()
  createdDate: Date;

  @IsDate()
  deletedDate: Date;

  authoritys: Authority[];
}
