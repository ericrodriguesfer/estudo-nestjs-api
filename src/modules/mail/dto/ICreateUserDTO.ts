import User from 'src/modules/user/infra/typeorm/entities/User';

interface ICreateUserDTO {
  user: User;
}

export default ICreateUserDTO;
