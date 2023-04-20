import {
  Length,
  IsEmail,
  IsString,
  IsDateString,
  IsNotEmpty,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { Authority } from 'src/entities/authority.entity';
import { Gender } from 'src/users/common/user.union';

export class CreateUserDto {
  @Transform((params) => params.value.trim())
  @IsNotEmpty()
  @IsString()
  @Length(4, 16)
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: '아이디는 영문과 숫자만 사용할 수 있습니다.',
  })
  id: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 20)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*)(]+$/, {
    message: '비밀번호는 하나 이상의 영문과 숫자를 포함해야 합니다.',
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  @Length(0, 20)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @Length(0, 45)
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 1)
  gender: Gender;

  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{2,3}-\d{3,4}-\d{4}$/, {
    message: '전화번호 형식이 올바르지 않습니다.',
  })
  tel: string;

  createdDate: Date;
  updatedDate: Date;
  deletedDate: Date;

  authoritys: Authority[];
}
