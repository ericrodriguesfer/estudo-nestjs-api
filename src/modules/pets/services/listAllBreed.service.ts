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

@Injectable()
class ListAllBreedService {
  constructor(
    @InjectRepository(Breed) private breedRepository: Repository<Breed>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async execute(
    id: string,
    { page, limit }: IPaginationOptions,
  ): Promise<Pagination<Breed>> {
    try {
      const existsUser: User = await this.userRepository.findOne({
        where: { id },
      });

      if (!existsUser) {
        throw new NotFoundException(
          'This user does not exists in our database',
        );
      }

      return await paginate<Breed>(
        this.breedRepository
          .createQueryBuilder('Breed')
          .where('Breed.user_id = :id', { id: existsUser.id }),
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

export default ListAllBreedService;
