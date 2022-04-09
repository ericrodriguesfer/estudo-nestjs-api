import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

class UpdatedPetDTO {
  @IsString({ message: 'This name variable need to be string' })
  @IsNotEmpty({ message: 'This name variable can not empty' })
  @IsOptional({
    message: 'This name variable is optional in update',
  })
  @ApiProperty()
  name?: string;

  @IsInt({ message: 'This age variable need to be int' })
  @IsNotEmpty({ message: 'This age variable can not empty' })
  @IsOptional({
    message: 'This age variable is optional in update',
  })
  @ApiProperty()
  age?: number;
}

export default UpdatedPetDTO;
