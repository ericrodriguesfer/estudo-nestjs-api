import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import SendEmailNewUserService from '../../mail/services/sendEmailNewUser.service';
import CreateUserDTO from '../dto/CreateUserDTO';
import User from '../infra/typeorm/entities/User';
import IHash from '../providers/Hash/contract/IHash';
import BCryptHash from '../providers/Hash/implementations/BCryptHash';

@Injectable()
class CreateUserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @Inject(BCryptHash) private readonly hashPassword: IHash,
    private mail: SendEmailNewUserService,
  ) {}

  async execute({
    name,
    username,
    email,
    password,
    phone,
  }: CreateUserDTO): Promise<User> {
    try {
      const userExistsByEmail: User = await this.userRepository.findOne({
        where: { email },
      });

      if (userExistsByEmail) {
        throw new ConflictException('This email is in usage for other user');
      }

      const userExistsByUserName: User = await this.userRepository.findOne({
        where: { username },
      });

      if (userExistsByUserName) {
        throw new ConflictException('This username is in usage for other user');
      }

      const userExistsByPhoneNumber: User = await this.userRepository.findOne({
        where: { phone },
      });

      if (userExistsByPhoneNumber) {
        throw new ConflictException(
          'This phone number is in usage for other user',
        );
      }

      const passwordHash: string = await this.hashPassword.generateHash(
        password,
      );

      const user: User = this.userRepository.create({
        name,
        username,
        email,
        password: passwordHash,
        phone,
      });

      await this.userRepository.save(user);

      await this.mail.execute({ user });

      return user;
    } catch (error) {
      if (error) throw error;
      throw new InternalServerErrorException(
        'Error intern in server, please try again',
      );
    }
  }
}

export default CreateUserService;
