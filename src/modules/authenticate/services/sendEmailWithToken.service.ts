import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { addDays, isAfter } from 'date-fns';
import { Repository } from 'typeorm';
import SendEmailWithTokenForRecoverPasswordService from '../../../modules/mail/services/sendEmailWithTokenForRecoverPassword.service';
import User from '../../../modules/user/infra/typeorm/entities/User';
import SendEmailWithTokenDTO from '../dto/SendEmailWithTokenDTO';
import Token from '../infra/typeorm/entities/Token';

@Injectable()
class SendEmailWithTokenService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Token) private tokenRepository: Repository<Token>,
    private mail: SendEmailWithTokenForRecoverPasswordService,
  ) {}

  async execute({ email }: SendEmailWithTokenDTO): Promise<Token> {
    try {
      const user: User = await this.userRepository.findOne({
        where: { email },
      });

      if (!user) {
        throw new NotFoundException('This user does not exists in database');
      }

      const lastToken: Token = await this.tokenRepository.findOne({
        where: { user_id: user.id },
        order: { created_at: 'DESC' },
      });

      if (
        isAfter(new Date(lastToken.expires), new Date()) &&
        lastToken &&
        !lastToken.used &&
        lastToken.used_in === null
      ) {
        await this.mail.execute({ user, token: lastToken.token });

        return lastToken;
      } else {
        const expires_in: Date = addDays(new Date(), 7);

        const token: Token = await this.tokenRepository.create({
          user_id: user.id,
          expires: expires_in,
        });

        await this.tokenRepository.save(token);

        await this.mail.execute({ user, token: token.token });

        return token;
      }
    } catch (error) {
      if (error) throw error;
      throw new InternalServerErrorException(
        'Error intern in server, please try again',
      );
    }
  }
}

export default SendEmailWithTokenService;
