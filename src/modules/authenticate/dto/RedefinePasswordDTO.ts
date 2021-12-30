import { IsNotEmpty, IsString, IsUUID, Length } from 'class-validator';

class RedefinePasswordDTO {
  @IsString({ message: 'This token variable need to be string' })
  @IsNotEmpty({ message: 'This token variable can not empty' })
  @IsUUID()
  token: string;

  @IsString({ message: 'This password variable need to be string' })
  @IsNotEmpty({ message: 'This password variable can not empty' })
  @Length(4, 50, {
    message:
      'This password variable can lenght min 4 characteres or max 50 characteres',
  })
  password: string;

  @IsString({ message: 'This confirm password variable need to be string' })
  @IsNotEmpty({ message: 'This confirm password variable can not empty' })
  @Length(4, 50, {
    message:
      'This confirm password variable can lenght min 4 characteres or max 50 characteres',
  })
  confirmPassword: string;
}

export default RedefinePasswordDTO;
