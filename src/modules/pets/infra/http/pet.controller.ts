import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  Request,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import IRequestUser from 'src/modules/user/dto/IRequestUser';
import CreatePetDTO from '../../dto/CreatePetDTO';
import CreatePetService from '../../services/createPet.service';
import Pet from '../typeorm/entities/Pet';

@Controller('pet')
class PetController {
  constructor(private createPetService: CreatePetService) {}

  @Post()
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBody({ type: CreatePetDTO })
  createPet(
    @Request() request: IRequestUser,
    @Body() { name, age, breed }: CreatePetDTO,
  ): Promise<Pet> {
    return this.createPetService.execute(request.user.id, { name, age, breed });
  }
}

export default PetController;
