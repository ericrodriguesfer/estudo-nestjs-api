import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

class CreatePetDTO {
  @IsString({ message: 'This name variable need to be string' })
  @IsNotEmpty({ message: 'This name variable can not empty' })
  @ApiProperty()
  name: string;

  @IsInt({ message: 'This age variable need to be int' })
  @IsNotEmpty({ message: 'This age variable can not empty' })
  @ApiProperty()
  age: number;

  @IsString({ message: 'This breed variable need to be string' })
  @IsNotEmpty({ message: 'This breed variable can not empty' })
  @ApiProperty()
  breed: string;
}

export default CreatePetDTO;
