import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import UpdateUserDTO from '../dto/UpdateUserDTO';
import User from '../infra/typeorm/entities/User';
import IHash from '../providers/Hash/contract/IHash';
import BCryptHash from '../providers/Hash/implementations/BCryptHash';

@Injectable()
class UpdateUserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @Inject(BCryptHash) private readonly hashPassword: IHash,
  ) {}

  async execute(
    id: string,
    { name, username, email, password, phone }: UpdateUserDTO,
  ): Promise<User> {
    try {
      const user: User = await this.userRepository.findOne({ where: { id } });

      if (!user) {
        throw new NotFoundException('This user does not exists in database');
      }

      if (email && user.email !== email) {
        const userExistsByEmail: User = await this.userRepository.findOne({
          where: { email },
        });

        if (userExistsByEmail) {
          throw new UnauthorizedException(
            'This email is in usage for other user',
          );
        }
      }

      if (username && user.username !== username) {
        const userExistsByUserName: User = await this.userRepository.findOne({
          where: { username },
        });

        if (userExistsByUserName) {
          throw new UnauthorizedException(
            'This username is in usage for other user',
          );
        }
      }

      if (phone && user.phone !== phone) {
        const userExistsByPhoneNumber: User = await this.userRepository.findOne(
          {
            where: { phone },
          },
        );

        if (userExistsByPhoneNumber) {
          throw new UnauthorizedException(
            'This phone number is in usage for other user',
          );
        }
      }

      if (password) {
        password = await this.hashPassword.generateHash(password);
      }

      const updateUser: User = await this.userRepository.merge(user, {
        name,
        username,
        email,
        password,
        phone,
      });

      await this.userRepository.save(updateUser);

      return updateUser;
    } catch (error) {
      if (error) throw error;
      throw new InternalServerErrorException(
        'Error intern in server, please try again',
      );
    }
  }
}

export default UpdateUserService;
