import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from 'src/modules/user/infra/typeorm/entities/User';
import { DeleteResult, Repository } from 'typeorm';
import IResponseBreed from '../dto/IResponseBreed';
import Breed from '../infra/typeorm/entities/Breed';

@Injectable()
class DeleteBreedService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Breed) private breedRepository: Repository<Breed>,
  ) {}

  async execute(id: string, idBreed: string): Promise<IResponseBreed> {
    try {
      const userExists: User = await this.userRepository.findOne({
        where: { id },
      });

      if (!userExists) {
        throw new NotFoundException('The user of this requisition not found');
      }

      const breedExists: Breed = await this.breedRepository.findOne({
        where: { id: idBreed },
      });

      if (!breedExists) {
        throw new NotFoundException(
          'This breed does not exists in our database',
        );
      }

      const deletedBreed: DeleteResult = await this.breedRepository.delete(
        breedExists.id,
      );

      if (deletedBreed.affected === 1) {
        return { message: 'This breed was deleted with success' };
      } else {
        return { message: 'This breed was not successfully deleted' };
      }
    } catch (error) {
      if (error) throw error;
      throw new InternalServerErrorException(
        'Error intern in server, please try again',
      );
    }
  }
}

export default DeleteBreedService;
