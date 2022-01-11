import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

class SendEmailWithTokenDTO {
  @IsString({ message: 'This email variable need to be string' })
  @IsEmail()
  @IsNotEmpty({ message: 'This email variable can not empty' })
  @ApiProperty()
  email: string;
}

export default SendEmailWithTokenDTO;
