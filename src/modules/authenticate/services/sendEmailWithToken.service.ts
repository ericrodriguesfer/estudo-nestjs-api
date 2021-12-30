import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectSendGrid, SendGridService } from '@ntegral/nestjs-sendgrid';
import User from 'src/modules/user/infra/typeorm/entities/User';
import { Repository } from 'typeorm';
import { addDays } from 'date-fns';
import SendEmailWithTokenDTO from '../dto/SendEmailWithTokenDTO';
import Token from '../infra/typeorm/entities/Token';

@Injectable()
class SendEmailWithTokenService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Token) private tokenRepository: Repository<Token>,
    @InjectSendGrid() private readonly sendGrid: SendGridService,
  ) {}

  async execute({ email }: SendEmailWithTokenDTO): Promise<Token> {
    try {
      const user: User = await this.userRepository.findOne({
        where: { email },
      });

      if (!user) {
        throw new NotFoundException('This user does not exists in database');
      }

      const expires_in: Date = addDays(new Date(), 7);

      const token: Token = await this.tokenRepository.create({
        user_id: user.id,
        expires: expires_in,
      });

      await this.tokenRepository.save(token);

      await this.sendGrid
        .send({
          to: email,
          from: process.env.SENDGRID_EMAIL_FROM,
          subject: process.env.SENDGRID_EMAIL_SUBJECT,
          templateId: process.env.SENDGRID_EMAIL_TEMPLAT_ID_RECOVER_PASSWORD,
          dynamicTemplateData: {
            name: user.name,
            token: token.token,
          },
        })
        .catch((error) => console.log(error.response.body));

      return token;
    } catch (error) {
      if (error) throw error;
      throw new InternalServerErrorException(
        'Error intern in server, please try again',
      );
    }
  }
}

export default SendEmailWithTokenService;
