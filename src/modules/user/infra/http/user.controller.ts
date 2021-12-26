import { Body, Controller, Post } from '@nestjs/common';
import ICreateUserDTO from '../../dto/ICreateUserDTO';
import CreateUserService from '../../services/createUser.service';
import User from '../typeorm/entities/User';

@Controller('user')
class UserController {
  constructor(private createUserService: CreateUserService) {}

  @Post()
  createUser(
    @Body() { name, username, email, password }: ICreateUserDTO,
  ): Promise<User> {
    return this.createUserService.execute({ name, username, email, password });
  }
}

export default UserController;
