import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from '../user/infra/typeorm/entities/User';
import PetController from './infra/http/pet.controller';
import Breed from './infra/typeorm/entities/Breed';
import Pet from './infra/typeorm/entities/Pet';
import SetNameBreedToCapitalize from './providers/BreedNameToCapitalize/SetNameBreedToCapitalize';
import CreatePetService from './services/createPet.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([User, Breed, Pet]),
  ],
  controllers: [PetController],
  providers: [CreatePetService, SetNameBreedToCapitalize],
})
export class PetModule {}
