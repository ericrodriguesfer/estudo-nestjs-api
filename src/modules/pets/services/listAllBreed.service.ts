import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from 'src/modules/user/infra/typeorm/entities/User';
import { Repository } from 'typeorm';
import Breed from '../infra/typeorm/entities/Breed';

@Injectable()
class ListAllBreedService {
  constructor(
    @InjectRepository(Breed) private breedRepository: Repository<Breed>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async execute(id: string): Promise<Array<Breed>> {
    try {
      const existsUser: User = await this.userRepository.findOne({
        where: { id },
      });

      if (!existsUser) {
        throw new NotFoundException(
          'This user does not exists in our database',
        );
      }

      const breeds: Array<Breed> = await this.breedRepository.find({
        where: { user_id: existsUser.id },
      });

      return breeds;
    } catch (error) {
      if (error) throw error;
      throw new InternalServerErrorException(
        'Error intern in server, please try again',
      );
    }
  }
}

export default ListAllBreedService;
