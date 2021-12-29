import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import User from 'src/modules/user/infra/typeorm/entities/User';
import { Repository } from 'typeorm';
import CreateSessionDTO from '../dto/CreateSessionDTO';
import IHashPasswordContract from '../providers/Hash/contract/IHashPasswordContract';
import BCryptHashPassword from '../providers/Hash/implementations/BCryptHashPassword';

@Injectable()
class CreateSessionService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @Inject(BCryptHashPassword)
    private readonly hashPassword: IHashPasswordContract,
    private jwtService: JwtService,
  ) {}

  async execute({ email, password }: CreateSessionDTO): Promise<string> {
    try {
      const user: User = await this.userRepository.findOne({
        where: { email },
      });

      if (!user) {
        throw new NotFoundException('This user does not exists in database');
      }

      const verifyCombineUserPassword: boolean =
        await this.hashPassword.compareHash(password, user.password);

      if (!verifyCombineUserPassword) {
        throw new UnauthorizedException(
          'This password repassed does not match',
        );
      }

      return this.jwtService.sign({
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
      });
    } catch (error) {
      if (error) throw error;
      throw new InternalServerErrorException(
        'Error intern in server, please try again',
      );
    }
  }
}

export default CreateSessionService;
