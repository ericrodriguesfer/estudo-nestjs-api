import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from 'src/modules/user/infra/typeorm/entities/User';
import { Repository } from 'typeorm';
import Breed from '../infra/typeorm/entities/Breed';
import Pet from '../infra/typeorm/entities/Pet';

@Injectable()
class ListAllPetService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Pet) private petRepository: Repository<Pet>,
    @InjectRepository(Breed) private breedRepository: Repository<Breed>,
  ) {}

  async execute(id: string): Promise<Array<Pet>> {
    try {
      const userExists: User = await this.userRepository.findOne({
        where: { id },
      });

      if (!userExists) {
        throw new NotFoundException('The user of this requisition not found');
      }

      const pets: Array<Pet> = await this.petRepository.find({
        where: { user_id: userExists.id },
      });

      return await Promise.all(
        pets.map(async (pet: Pet) => {
          pet.breed = await this.breedRepository.findOne({
            where: { id: pet.breed_id },
          });

          return pet;
        }),
      );
    } catch (error) {
      if (error) throw error;
      throw new InternalServerErrorException(
        'Error intern in server, please try again',
      );
    }
  }
}

export default ListAllPetService;
