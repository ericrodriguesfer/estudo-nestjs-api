import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
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

  async execute(
    id: string,
    idBreed: string,
    { page, limit }: IPaginationOptions,
  ): Promise<Pagination<Pet>> {
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
        where: { id: idBreed, user_id: existsUser.id },
      });

      if (!existsBreed) {
        throw new NotFoundException(
          'This breed does not exists in our database',
        );
      }

      return await paginate<Pet>(
        this.petRepository
          .createQueryBuilder('Pet')
          .where('Pet.breed_id = :id', { id: existsBreed.id }),
        { page, limit },
      );
    } catch (error) {
      if (error) throw error;
      throw new InternalServerErrorException(
        'Error intern in server, please try again',
      );
    }
  }
}

export default ListPetOfBreedService;
