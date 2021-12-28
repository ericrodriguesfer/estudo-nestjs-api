import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

class UpdateUserDTO {
  @IsString({ message: 'This name variable need to be string' })
  @IsNotEmpty({ message: 'This name variable can not empty' })
  @IsOptional()
  name?: string;

  @IsString({ message: 'This username variable need to be string' })
  @IsNotEmpty({ message: 'This username variable can not empty' })
  @Length(5, 20, {
    message:
      'This username variable can lenght min 5 characteres or max 20 characteres',
  })
  @IsOptional()
  username?: string;

  @IsString({ message: 'This email variable need to be string' })
  @IsEmail()
  @IsNotEmpty({ message: 'This email variable can not empty' })
  @IsOptional()
  email?: string;

  @IsString({ message: 'This password variable need to be string' })
  @IsNotEmpty({ message: 'This password variable can not empty' })
  @Length(4, 50, {
    message:
      'This password variable can lenght min 4 characteres or max 50 characteres',
  })
  @IsOptional()
  password?: string;
}

export default UpdateUserDTO;
