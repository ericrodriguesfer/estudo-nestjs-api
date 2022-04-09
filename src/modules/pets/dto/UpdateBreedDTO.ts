import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

class UpdateBreedDTO {
  @IsString({ message: 'This idUser variable need to be string' })
  @IsNotEmpty({ message: 'This idUser variable can not empty' })
  @ApiProperty()
  idUser: string;

  @IsString({ message: 'This idBreed variable need to be string' })
  @IsNotEmpty({ message: 'This idBreed variable can not empty' })
  @ApiProperty()
  idBreed: string;

  @IsString({ message: 'This name variable need to be string' })
  @IsNotEmpty({ message: 'This name variable can not empty' })
  @ApiProperty()
  name: string;
}

export default UpdateBreedDTO;
