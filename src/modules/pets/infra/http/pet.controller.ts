import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Request,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import IRequestUser from 'src/modules/user/dto/IRequestUser';
import CreatePetDTO from '../../dto/CreatePetDTO';
import IResponseBreed from '../../dto/IResponseBreed';
import IResponsePet from '../../dto/IResponsePet';
import UpdatedPetDTO from '../../dto/UpdatedPetDTO';
import CreatePetService from '../../services/createPet.service';
import DeleteBreedService from '../../services/deleteBreed.service';
import DeletePetService from '../../services/deletePet.service';
import ListAllBreedService from '../../services/listAllBreed.service';
import ListAllPetService from '../../services/listAllPet.service';
import ListPetOfBreedService from '../../services/listPetOfBreed.service';
import UpdateBreedService from '../../services/updateBreed.service';
import UpdatePetService from '../../services/updatePet.service';
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
    private updateBreedService: UpdateBreedService,
    private updatePetService: UpdatePetService,
    private deletePetService: DeletePetService,
  ) {}

  @Get()
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  getAllPets(
    @Request() request: IRequestUser,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit = 5,
  ): Promise<Pagination<Pet>> {
    limit = limit > 10 ? 10 : limit;
    return this.listAllPetService.execute(request.user.id, { page, limit });
  }

  @Get('breeds')
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  getAllBreeds(
    @Request() request: IRequestUser,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit = 5,
  ): Promise<Pagination<Breed>> {
    limit = limit > 10 ? 10 : limit;
    return this.listAllBreedsService.execute(request.user.id, { page, limit });
  }

  @Get('breed/:id')
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  getAllPetOfBreed(
    @Request() request: IRequestUser,
    @Param('id') id: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit = 5,
  ): Promise<Pagination<Breed>> {
    limit = limit > 10 ? 10 : limit;
    return this.listAllPetOfBreedService.execute(request.user.id, id, {
      page,
      limit,
    });
  }

  @Put('breed/:id')
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  updateBreed(
    @Request() request: IRequestUser,
    @Param('id') id: string,
    @Body('name') name: string,
  ): Promise<Breed> {
    return this.updateBreedService.execute({
      idUser: request.user.id,
      idBreed: id,
      name,
    });
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

  @Put(':id')
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  updatePet(
    @Request() request: IRequestUser,
    @Param('id') id: string,
    @Body() pet: UpdatedPetDTO,
  ): Promise<Pet> {
    return this.updatePetService.execute(request.user.id, id, pet);
  }

  @Delete(':id')
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  deletePet(
    @Request() request: IRequestUser,
    @Param('id') id: string,
  ): Promise<IResponsePet> {
    return this.deletePetService.execute(request.user.id, id);
  }
}

export default PetController;
