import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from 'src/modules/user/infra/typeorm/entities/User';
import { Repository } from 'typeorm';
import UpdatedPetDTO from '../dto/UpdatedPetDTO';
import Pet from '../infra/typeorm/entities/Pet';
import SetNameBreedToCapitalize from '../providers/BreedNameToCapitalize/SetNameBreedToCapitalize';

@Injectable()
class UpdatePetService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Pet) private petRepository: Repository<Pet>,
    private capitalizeBreedName: SetNameBreedToCapitalize,
  ) {}

  async execute(
    idUser: string,
    idPet: string,
    { name, age }: UpdatedPetDTO,
  ): Promise<Pet> {
    try {
      const userExists: User = await this.userRepository.findOne({
        where: { id: idUser },
      });

      if (!userExists) {
        throw new NotFoundException('The user of this requisition not found');
      }

      const petExists: Pet = await this.petRepository.findOne({
        where: { id: idPet },
      });

      if (!petExists) {
        throw new NotFoundException('The pet of this requisition not found');
      }

      if (name && petExists.name !== name) {
        const existsPetByName: Pet = await this.petRepository.findOne({
          where: { name: this.capitalizeBreedName.capitalizeName(name) },
        });

        if (existsPetByName && existsPetByName?.id !== petExists.id) {
          throw new ConflictException(
            'This name for pet already exists in other pet',
          );
        }

        petExists.name = this.capitalizeBreedName.capitalizeName(name);
      }

      if (age && petExists.age !== age) {
        petExists.age = age;
      }

      const petUpdated: Pet = await this.petRepository.merge(petExists, {
        name,
        age,
      });

      await this.petRepository.save(petUpdated);

      return petUpdated;
    } catch (error) {
      if (error) throw error;
      throw new InternalServerErrorException(
        'Error intern in server, please try again',
      );
    }
  }
}

export default UpdatePetService;
