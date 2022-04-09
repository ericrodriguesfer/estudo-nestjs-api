import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from 'src/modules/user/infra/typeorm/entities/User';
import { Repository } from 'typeorm';
import Breed from '../infra/typeorm/entities/Breed';
import Pet from '../infra/typeorm/entities/Pet';

class ListPetOfBreedService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Breed) private breedRepository: Repository<Breed>,
    @InjectRepository(Pet) private petRepository: Repository<Pet>,
  ) {}

  async execute(id: string, idBreed: string): Promise<Array<Pet>> {
    try {
      const existsUser: User = await this.userRepository.findOne({
        where: { id },
      });

      if (!existsUser) {
        throw new NotFoundException(
          'This user does not exists in our database',
        );
      }

      const existsBreed: Breed = await this.breedRepository.findOne({
        where: { id: idBreed },
      });

      if (!existsBreed) {
        throw new NotFoundException(
          'This breed does not exists in our database',
        );
      }

      const pets: Array<Pet> = await this.petRepository.find({
        where: { breed_id: existsBreed.id },
      });

      return pets;
    } catch (error) {
      if (error) throw error;
      throw new InternalServerErrorException(
        'Error intern in server, please try again',
      );
    }
  }
}

export default ListPetOfBreedService;
