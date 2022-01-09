import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import ISendEmailConfirmPasswordDTO from '../dto/ISendEmailConfirmPasswordDTO';

@Injectable()
class SendEmailConfirmRecoverPasswordService {
  constructor(private mailer: MailerService) {}

  async execute({ user }: ISendEmailConfirmPasswordDTO): Promise<void> {
    await this.mailer
      .sendMail({
        to: user.email,
        from: 'No reply this email please' + process.env.MAIL_FROM,
        subject: 'Confirm redefine password successfly',
        template: 'confirmRedefinePassword',
        context: {
          name: user.name,
        },
      })
      .catch((error) => {
        console.log('ERROR SEND EMAIL WITH TOKEN: ' + error);
      });
  }
}

export default SendEmailConfirmRecoverPasswordService;
