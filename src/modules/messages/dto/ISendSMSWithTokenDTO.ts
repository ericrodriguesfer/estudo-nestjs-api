import User from 'src/modules/user/infra/typeorm/entities/User';

interface ISendSMSWithTokenDTO {
  user: User;
  token: string;
}

export default ISendSMSWithTokenDTO;
