import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from 'src/modules/user/infra/typeorm/entities/User';
import { Repository } from 'typeorm';
import CreatePetDTO from '../dto/CreatePetDTO';
import Breed from '../infra/typeorm/entities/Breed';
import Pet from '../infra/typeorm/entities/Pet';
import SetNameBreedToCapitalize from '../providers/BreedNameToCapitalize/SetNameBreedToCapitalize';

@Injectable()
class CreatePetService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Breed) private breedRepository: Repository<Breed>,
    @InjectRepository(Pet) private petRepository: Repository<Pet>,
    private capitalizeBreedName: SetNameBreedToCapitalize,
  ) {}

  async execute(id: string, { name, age, breed }: CreatePetDTO): Promise<Pet> {
    try {
      const existsUser: User = await this.userRepository.findOne({
        where: { id },
      });

      if (!existsUser) {
        throw new NotFoundException(
          'This user does not exists in our database',
        );
      }

      const existsPetByName: Pet = await this.petRepository.findOne({
        where: { name },
      });

      if (existsPetByName) {
        throw new ConflictException(
          'This name pet already exists in other pet',
        );
      }

      const existsBreed: Breed = await this.breedRepository.findOne({
        where: { name: this.capitalizeBreedName.capitalizeName(breed) },
      });

      if (!existsBreed) {
        const breedCreated: Breed = await this.breedRepository.create({
          name: this.capitalizeBreedName.capitalizeName(breed),
          user_id: existsUser.id,
        });

        await this.breedRepository.save(breedCreated);

        const pet: Pet = await this.petRepository.create({
          name,
          age,
          breed_id: breedCreated.id,
          user_id: existsUser.id,
        });

        await this.petRepository.save(pet);

        return pet;
      } else {
        const pet: Pet = await this.petRepository.create({
          name,
          age,
          breed_id: existsBreed.id,
          user_id: existsUser.id,
        });

        await this.petRepository.save(pet);

        return pet;
      }
    } catch (error) {
      if (error) throw error;
      throw new InternalServerErrorException(
        'Error intern in server, please try again',
      );
    }
  }
}

export default CreatePetService;
