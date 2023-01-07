import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class LoginUserDto {
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
}
