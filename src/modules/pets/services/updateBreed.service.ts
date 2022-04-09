import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from 'src/modules/user/infra/typeorm/entities/User';
import { Repository } from 'typeorm';
import UpdateBreedDTO from '../dto/UpdateBreedDTO';
import Breed from '../infra/typeorm/entities/Breed';
import SetNameBreedToCapitalize from '../providers/BreedNameToCapitalize/SetNameBreedToCapitalize';

@Injectable()
class UpdateBreedService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Breed) private breedRepository: Repository<Breed>,
    private capitalizeBreedName: SetNameBreedToCapitalize,
  ) {}

  async execute({ idUser, idBreed, name }: UpdateBreedDTO): Promise<Breed> {
    try {
      const userExists: User = await this.userRepository.findOne({
        where: { id: idUser },
      });

      if (!userExists) {
        throw new NotFoundException('The user of this requisition not found');
      }

      const breedExists: Breed = await this.breedRepository.findOne({
        where: { id: idBreed },
      });

      if (!breedExists) {
        throw new NotFoundException('The breed of this requisition not found');
      }

      const breedExistsByName: Breed = await this.breedRepository.findOne({
        where: { name: this.capitalizeBreedName.capitalizeName(name) },
      });

      if (breedExistsByName.id !== breedExists.id) {
        throw new ConflictException(
          'This name for breed already exists in other breed',
        );
      }

      const updateBreed: Breed = await this.breedRepository.merge(breedExists, {
        name: this.capitalizeBreedName.capitalizeName(name),
      });

      await this.breedRepository.save(updateBreed);

      return updateBreed;
    } catch (error) {
      if (error) throw error;
      throw new InternalServerErrorException(
        'Error intern in server, please try again',
      );
    }
  }
}

export default UpdateBreedService;
