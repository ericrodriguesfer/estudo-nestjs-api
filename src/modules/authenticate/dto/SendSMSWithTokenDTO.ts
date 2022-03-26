import { ApiProperty } from '@nestjs/swagger';
import { IsMobilePhone, IsNotEmpty, IsString } from 'class-validator';

class SendSMSWithTokenDTO {
  @IsString({ message: 'This phone variable need to be string' })
  @IsNotEmpty({ message: 'This phone variable can not empty' })
  @IsMobilePhone()
  @ApiProperty()
  phone: string;
}

export default SendSMSWithTokenDTO;
