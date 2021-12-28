import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CreateUserDTO from '../dto/CreateUserDTO';
import User from '../infra/typeorm/entities/User';
import BCryptHash from '../providers/Hash/implementations/BCryptHash';
import IHash from '../providers/Hash/contract/IHash';
import { InjectSendGrid, SendGridService } from '@ntegral/nestjs-sendgrid';

@Injectable()
class CreateUserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @Inject(BCryptHash) private readonly hashPassword: IHash,
    @InjectSendGrid() private readonly sendGrid: SendGridService,
  ) {}

  async execute({
    name,
    username,
    email,
    password,
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

      await this.sendGrid
        .send({
          to: email,
          from: process.env.SENDGRID_EMAIL_FROM,
          subject: process.env.SENDGRID_EMAIL_SUBJECT,
          templateId: process.env.SENDGRID_EMAIL_TEMPLAT_ID,
        })
        .catch((error) => {
          console.log(error.response.body);
        });

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
