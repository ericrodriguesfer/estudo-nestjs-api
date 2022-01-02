import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import IGetMeData from '../dto/IGetMeData';
import User from '../infra/typeorm/entities/User';

@Injectable()
class GetMeDataService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async execute({ email }: IGetMeData): Promise<User> {
    try {
      const user: User = await this.userRepository.findOne({
        where: { email },
      });

      if (!user) {
        throw new NotFoundException('This user not found in our database');
      }

      return user;
    } catch (error) {
      if (error) throw error;
      throw new InternalServerErrorException(
        'Error intern in server, please try again',
      );
    }
  }
}

export default GetMeDataService;
