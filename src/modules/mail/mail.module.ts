import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import SendEmailNewUserService from './services/sendEmailNewUser.service';
import SendEmailWithTokenForRecoverPasswordService from './services/sendEmailWithTokenForRecoverPassword.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MailerModule.forRootAsync({
      useFactory: async () => ({
        transport: {
          host: process.env.MAIL_HOST,
          secure: false,
          auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD,
          },
        },
        defaults: {
          from: 'No reply this email ' + process.env.MAIL_FROM,
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  controllers: [],
  providers: [
    SendEmailNewUserService,
    SendEmailWithTokenForRecoverPasswordService,
  ],
  exports: [
    SendEmailNewUserService,
    SendEmailWithTokenForRecoverPasswordService,
  ],
})
export class MailModule {}
