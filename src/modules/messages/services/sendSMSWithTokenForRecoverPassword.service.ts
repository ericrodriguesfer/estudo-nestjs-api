import { InjectTwilio, TwilioClient } from 'nestjs-twilio';
import { MessageInstance } from 'twilio/lib/rest/api/v2010/account/message';
import ISendSMSWithTokenDTO from '../dto/ISendSMSWithTokenDTO';

class SendSMSWithTokenForRecoverPasswordService {
  constructor(@InjectTwilio() private readonly client: TwilioClient) {}

  async execute({
    user,
    token,
  }: ISendSMSWithTokenDTO): Promise<MessageInstance> {
    try {
      return await this.client.messages.create({
        body: `Hello ${user.name}, this is code for recover password what your requested. Code: ${token}`,
        from: process.env.SMS_PHONE_NUMBER,
        to: user.phone,
      });
    } catch (error) {
      console.log('ERROR SEND SMS WITH TOKEN: ' + error);
    }
  }
}

export default SendSMSWithTokenForRecoverPasswordService;
