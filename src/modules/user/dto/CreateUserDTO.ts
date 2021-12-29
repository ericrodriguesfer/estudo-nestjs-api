import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

class CreateUserDTO {
  @IsString({ message: 'This name variable need to be string' })
  @IsNotEmpty({ message: 'This name variable can not empty' })
  name: string;

  @IsString({ message: 'This username variable need to be string' })
  @IsNotEmpty({ message: 'This username variable can not empty' })
  @Length(5, 20, {
    message:
      'This username variable can lenght min 5 characteres or max 20 characteres',
  })
  username: string;

  @IsString({ message: 'This email variable need to be string' })
  @IsEmail()
  @IsNotEmpty({ message: 'This email variable can not empty' })
  email: string;

  @IsString({ message: 'This password variable need to be string' })
  @IsNotEmpty({ message: 'This password variable can not empty' })
  @Length(4, 50, {
    message:
      'This password variable can lenght min 4 characteres or max 50 characteres',
  })
  password: string;
}

export default CreateUserDTO;
