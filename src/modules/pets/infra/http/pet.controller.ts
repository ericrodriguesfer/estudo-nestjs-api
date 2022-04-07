import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
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
import ListAllBreedService from '../../services/listAllBreed.service';
import ListPetOfBreedService from '../../services/listPetOfBreed.service';
import Breed from '../typeorm/entities/Breed';
import Pet from '../typeorm/entities/Pet';

@Controller('pet')
class PetController {
  constructor(
    private createPetService: CreatePetService,
    private listAllBreedsService: ListAllBreedService,
    private listAllPetOfBreed: ListPetOfBreedService,
  ) {}

  @Get('breeds')
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  getAllBreeds(@Request() request: IRequestUser): Promise<Array<Breed>> {
    return this.listAllBreedsService.execute(request.user.id);
  }

  @Get('breed/:id')
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  getAllPetOfBreed(
    @Request() request: IRequestUser,
    @Param('id') id: string,
  ): Promise<Array<Breed>> {
    return this.listAllPetOfBreed.execute(request.user.id, id);
  }

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
