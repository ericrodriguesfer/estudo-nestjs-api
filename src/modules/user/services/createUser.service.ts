import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import ICreateUserDTO from '../dto/ICreateUserDTO';
import User from '../infra/typeorm/entities/User';
import BCryptHash from '../providers/Hash/implementations/BCryptHash';
import IHash from '../providers/Hash/contract/IHash';

@Injectable()
class CreateUserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @Inject(BCryptHash) private readonly hashPassword: IHash,
  ) {}

  async execute({
    name,
    username,
    email,
    password,
  }: ICreateUserDTO): Promise<User> {
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

      const passwordHash: string = await this.hashPassword.generateHash(
        password,
      );

      const user = this.userRepository.create({
        name,
        username,
        email,
        password: passwordHash,
      });

      await this.userRepository.save(user);

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
