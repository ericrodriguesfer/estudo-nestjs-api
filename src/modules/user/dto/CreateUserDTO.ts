import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

class CreateUserDTO {
  @IsString({ message: 'This name variable need to be string' })
  @IsNotEmpty({ message: 'This name variable can not empty' })
  @ApiProperty()
  name: string;

  @IsString({ message: 'This username variable need to be string' })
  @IsNotEmpty({ message: 'This username variable can not empty' })
  @Length(5, 20, {
    message:
      'This username variable can lenght min 5 characteres or max 20 characteres',
  })
  @ApiProperty()
  username: string;

  @IsString({ message: 'This email variable need to be string' })
  @IsEmail()
  @IsNotEmpty({ message: 'This email variable can not empty' })
  @ApiProperty()
  email: string;

  @IsString({ message: 'This password variable need to be string' })
  @IsNotEmpty({ message: 'This password variable can not empty' })
  @Length(4, 50, {
    message:
      'This password variable can lenght min 4 characteres or max 50 characteres',
  })
  @ApiProperty()
  password: string;

  @IsString({ message: 'This phone variable need to be string' })
  @IsNotEmpty({ message: 'This phone variable can not empty' })
  // @Matches(/^1(\d{13})$/, {
  //   message: 'Your phone number must follow the format',
  // })
  phone: string;
}

export default CreateUserDTO;
