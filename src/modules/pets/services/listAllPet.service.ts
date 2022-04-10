import {
  Injectable,
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

@Injectable()
class ListAllPetService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Pet) private petRepository: Repository<Pet>,
    @InjectRepository(Breed) private breedRepository: Repository<Breed>,
  ) {}

  async execute(
    id: string,
    { page, limit }: IPaginationOptions,
  ): Promise<Pagination<Pet>> {
    try {
      const userExists: User = await this.userRepository.findOne({
        where: { id },
      });

      if (!userExists) {
        throw new NotFoundException('The user of this requisition not found');
      }

      const results = await paginate<Pet>(
        this.petRepository
          .createQueryBuilder('Pet')
          .where('Pet.user_id = :id', { id: userExists.id }),
        {
          page,
          limit,
        },
      );

      return new Pagination(
        await Promise.all(
          results.items.map(async (pet: Pet) => {
            pet.breed = await this.breedRepository.findOne({
              where: { id: pet.breed_id },
            });

            return pet;
          }),
        ),
        results.meta,
        results.links,
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
