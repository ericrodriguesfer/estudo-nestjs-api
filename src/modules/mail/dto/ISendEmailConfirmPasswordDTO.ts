import User from 'src/modules/user/infra/typeorm/entities/User';

interface ISendEmailConfirmPasswordDTO {
  user: User;
}

export default ISendEmailConfirmPasswordDTO;
