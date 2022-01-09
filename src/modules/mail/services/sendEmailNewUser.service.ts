import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import ICreateUserDTO from '../dto/ISendEmailCreateUserDTO';

@Injectable()
class SendEmailNewUserService {
  constructor(private mailer: MailerService) {}

  async execute({ user }: ICreateUserDTO) {
    await this.mailer
      .sendMail({
        to: user.email,
        from: 'No reply this email please' + process.env.MAIL_FROM,
        subject: 'Wellcome a nestjs application api',
        template: 'create',
        context: {
          name: user.name,
        },
      })
      .catch((error) => {
        console.log('ERROR SEND EMAIL NEW USER: ' + error);
      });
  }
}

export default SendEmailNewUserService;
