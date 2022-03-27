import User from 'src/modules/user/infra/typeorm/entities/User';

interface ISendSMSConfirmPasswordDTO {
  user: User;
}

export default ISendSMSConfirmPasswordDTO;
