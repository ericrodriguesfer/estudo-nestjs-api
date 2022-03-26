import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TwilioModule } from 'nestjs-twilio';
import SendSMSConfirmRecoverPasswordService from './services/sendSMSConfirmRecoverPassword.service';
import SendSMSWithTokenForRecoverPasswordService from './services/sendSMSWithTokenForRecoverPassword.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TwilioModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        accountSid: process.env.SMS_ACCOUNT_SID,
        authToken: process.env.SMS_AUTH_TOKEN,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [
    SendSMSWithTokenForRecoverPasswordService,
    SendSMSConfirmRecoverPasswordService,
  ],
  exports: [
    SendSMSWithTokenForRecoverPasswordService,
    SendSMSConfirmRecoverPasswordService,
  ],
})
export class MessagesModule {}
