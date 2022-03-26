import { InjectTwilio, TwilioClient } from 'nestjs-twilio';
import { MessageInstance } from 'twilio/lib/rest/api/v2010/account/message';
import ISendSMSConfirmPasswordDTO from '../dto/ISendSMSConfirmPasswordDTO';

class SendSMSConfirmRecoverPasswordService {
  constructor(@InjectTwilio() private readonly client: TwilioClient) {}

  async execute({
    user,
  }: ISendSMSConfirmPasswordDTO): Promise<MessageInstance> {
    try {
      return await this.client.messages.create({
        body: `Hello ${user.name}, your password was redefine with successfly.`,
        from: process.env.SMS_PHONE_NUMBER,
        to: user.phone,
      });
    } catch (error) {
      console.log('ERROR SEND SMS WITH TOKEN: ' + error);
    }
  }
}

export default SendSMSConfirmRecoverPasswordService;
