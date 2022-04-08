import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
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
import IResponseBreed from '../../dto/IResponseBreed';
import CreatePetService from '../../services/createPet.service';
import DeleteBreedService from '../../services/deleteBreed.service';
import ListAllBreedService from '../../services/listAllBreed.service';
import ListAllPetService from '../../services/listAllPet.service';
import ListPetOfBreedService from '../../services/listPetOfBreed.service';
import Breed from '../typeorm/entities/Breed';
import Pet from '../typeorm/entities/Pet';

@Controller('pet')
class PetController {
  constructor(
    private createPetService: CreatePetService,
    private listAllBreedsService: ListAllBreedService,
    private listAllPetOfBreedService: ListPetOfBreedService,
    private deleteBreedService: DeleteBreedService,
    private listAllPetService: ListAllPetService,
  ) {}

  @Get()
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  getAllPets(@Request() request: IRequestUser): Promise<Array<Pet>> {
    return this.listAllPetService.execute(request.user.id);
  }

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
    return this.listAllPetOfBreedService.execute(request.user.id, id);
  }

  @Delete('breed/:id')
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  deleteBreed(
    @Request() request: IRequestUser,
    @Param('id') id: string,
  ): Promise<IResponseBreed> {
    return this.deleteBreedService.execute(request.user.id, id);
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
