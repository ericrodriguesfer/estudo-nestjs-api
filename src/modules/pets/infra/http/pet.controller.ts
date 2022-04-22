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
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import UserDecorator from 'src/app/decorators/user.decorator';
import User from 'src/modules/user/infra/typeorm/entities/User';
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
    @UserDecorator() user: User,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit = 5,
  ): Promise<Pagination<Pet>> {
    limit = limit > 10 ? 10 : limit;
    return this.listAllPetService.execute(user.id, { page, limit });
  }

  @Get('breeds')
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  getAllBreeds(
    @UserDecorator() user: User,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit = 5,
  ): Promise<Pagination<Breed>> {
    limit = limit > 10 ? 10 : limit;
    return this.listAllBreedsService.execute(user.id, { page, limit });
  }

  @Get('breed/:id')
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  getAllPetOfBreed(
    @UserDecorator() user: User,
    @Param('id') id: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit = 5,
  ): Promise<Pagination<Breed>> {
    limit = limit > 10 ? 10 : limit;
    return this.listAllPetOfBreedService.execute(user.id, id, {
      page,
      limit,
    });
  }

  @Put('breed/:id')
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  updateBreed(
    @UserDecorator() user: User,
    @Param('id') id: string,
    @Body('name') name: string,
  ): Promise<Breed> {
    return this.updateBreedService.execute({
      idUser: user.id,
      idBreed: id,
      name,
    });
  }

  @Delete('breed/:id')
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  deleteBreed(
    @UserDecorator() user: User,
    @Param('id') id: string,
  ): Promise<IResponseBreed> {
    return this.deleteBreedService.execute(user.id, id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBody({ type: CreatePetDTO })
  createPet(
    @UserDecorator() user: User,
    @Body() { name, age, breed }: CreatePetDTO,
  ): Promise<Pet> {
    return this.createPetService.execute(user.id, { name, age, breed });
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  updatePet(
    @UserDecorator() user: User,
    @Param('id') id: string,
    @Body() pet: UpdatedPetDTO,
  ): Promise<Pet> {
    return this.updatePetService.execute(user.id, id, pet);
  }

  @Delete(':id')
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  deletePet(
    @UserDecorator() user: User,
    @Param('id') id: string,
  ): Promise<IResponsePet> {
    return this.deletePetService.execute(user.id, id);
  }
}

export default PetController;
