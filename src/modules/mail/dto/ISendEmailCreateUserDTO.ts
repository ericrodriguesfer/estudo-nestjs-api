import User from 'src/modules/user/infra/typeorm/entities/User';

interface ISendEmailCreateUserDTO {
  user: User;
}

export default ISendEmailCreateUserDTO;
