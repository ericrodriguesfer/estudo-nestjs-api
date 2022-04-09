import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from 'src/modules/user/infra/typeorm/entities/User';
import { DeleteResult, Repository } from 'typeorm';
import IResponsePet from '../dto/IResponsePet';
import Pet from '../infra/typeorm/entities/Pet';

@Injectable()
class DeletePetService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Pet) private petRepository: Repository<Pet>,
  ) {}

  async execute(idUser: string, idPet: string): Promise<IResponsePet> {
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
        throw new NotFoundException('This pet does not exists in our database');
      }

      const deletedPet: DeleteResult = await this.petRepository.delete(
        petExists.id,
      );

      if (deletedPet.affected === 1) {
        return { message: 'This pet was deleted with success' };
      } else {
        return { message: 'This pet was not successfully deleted' };
      }
    } catch (error) {
      if (error) throw error;
      throw new InternalServerErrorException(
        'Error intern in server, please try again',
      );
    }
  }
}

export default DeletePetService;
