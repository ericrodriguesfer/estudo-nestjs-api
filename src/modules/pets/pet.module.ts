import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from '../user/infra/typeorm/entities/User';
import PetController from './infra/http/pet.controller';
import Breed from './infra/typeorm/entities/Breed';
import Pet from './infra/typeorm/entities/Pet';
import SetNameBreedToCapitalize from './providers/BreedNameToCapitalize/SetNameBreedToCapitalize';
import CreatePetService from './services/createPet.service';
import DeleteBreedService from './services/deleteBreed.service';
import DeletePetService from './services/deletePet.service';
import ListAllBreedService from './services/listAllBreed.service';
import ListAllPetService from './services/listAllPet.service';
import ListPetOfBreedService from './services/listPetOfBreed.service';
import UpdateBreedService from './services/updateBreed.service';
import UpdatePetService from './services/updatePet.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([User, Breed, Pet]),
  ],
  controllers: [PetController],
  providers: [
    CreatePetService,
    ListAllBreedService,
    ListPetOfBreedService,
    DeleteBreedService,
    ListAllPetService,
    UpdateBreedService,
    DeletePetService,
    UpdatePetService,
    SetNameBreedToCapitalize,
  ],
})
export class PetModule {}
