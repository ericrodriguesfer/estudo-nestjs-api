import User from 'src/modules/user/infra/typeorm/entities/User';

interface ISendEmailWithTokenDTO {
  user: User;
  token: string;
}

export default ISendEmailWithTokenDTO;
