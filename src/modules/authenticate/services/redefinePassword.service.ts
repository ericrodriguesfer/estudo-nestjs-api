import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isAfter } from 'date-fns';
import { Repository } from 'typeorm';
import SendEmailConfirmRecoverPasswordService from '../../../modules/mail/services/sendEmailConfirmRecoverPassword.service';
import SendSMSConfirmRecoverPasswordService from '../../../modules/messages/services/sendSMSConfirmRecoverPassword.service';
import User from '../../../modules/user/infra/typeorm/entities/User';
import RedefinePasswordDTO from '../dto/RedefinePasswordDTO';
import Token from '../infra/typeorm/entities/Token';
import IHashPasswordContract from '../providers/Hash/contract/IHashPasswordContract';
import BCryptHashPassword from '../providers/Hash/implementations/BCryptHashPassword';

@Injectable()
class RedefinePasswordService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Token) private tokenRepository: Repository<Token>,
    @Inject(BCryptHashPassword)
    private readonly hashPassword: IHashPasswordContract,
    private mail: SendEmailConfirmRecoverPasswordService,
    private sms: SendSMSConfirmRecoverPasswordService,
  ) {}

  async execute({
    token,
    password,
    confirmPassword,
  }: RedefinePasswordDTO): Promise<User> {
    try {
      const tokenRedefinePassword: Token = await this.tokenRepository.findOne({
        where: { token },
      });

      if (!tokenRedefinePassword) {
        throw new NotFoundException('This token does not exists in database');
      }

      const user: User = await this.userRepository.findOne({
        where: { id: tokenRedefinePassword.user_id },
      });

      if (!user) {
        throw new NotFoundException(
          'This user of this token does not exists in database',
        );
      }

      const tokens: Array<Token> = await this.tokenRepository.find({
        where: { user_id: user.id },
      });

      tokens.map((otherToken) => {
        if (
          !isAfter(tokenRedefinePassword.created_at, otherToken.created_at) &&
          otherToken.token != token
        ) {
          throw new UnauthorizedException('This token does not active');
        }
      });

      if (!isAfter(new Date(tokenRedefinePassword.expires), new Date())) {
        throw new UnauthorizedException('This token has expired');
      }

      if (
        tokenRedefinePassword.used ||
        tokenRedefinePassword.used_in !== null
      ) {
        throw new UnauthorizedException('This token was used previously');
      }

      if (password !== confirmPassword) {
        throw new UnauthorizedException(
          'This passwords repassed does not match',
        );
      }

      const newPasswordIsEqualLastPassword: boolean =
        await this.hashPassword.compareHash(password, user.password);

      if (newPasswordIsEqualLastPassword) {
        throw new UnauthorizedException(
          'This new password is equal the last password, try other',
        );
      }

      const passwordHash: string = await this.hashPassword.generateHash(
        password,
      );

      const updatedUser: User = await this.userRepository.merge(user, {
        password: passwordHash,
      });

      const updatedToken: Token = await this.tokenRepository.merge(
        tokenRedefinePassword,
        { used: true, used_in: new Date() },
      );

      await this.userRepository.save(updatedUser);
      await this.tokenRepository.save(updatedToken);

      await this.mail.execute({ user });
      await this.sms.execute({ user });

      return updatedUser;
    } catch (error) {
      if (error) throw error;
      throw new InternalServerErrorException(
        'Error intern in server, please try again',
      );
    }
  }
}

export default RedefinePasswordService;
