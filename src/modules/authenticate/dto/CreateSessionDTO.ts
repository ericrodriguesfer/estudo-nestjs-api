import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

class CreateSessionDTO {
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
}

export default CreateSessionDTO;
