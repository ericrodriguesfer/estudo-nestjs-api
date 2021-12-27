import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import CreateUserDTO from '../../dto/CreateUserDTO';
import CreateUserService from '../../services/createUser.service';
import User from '../typeorm/entities/User';

@Controller('user')
class UserController {
  constructor(private createUserService: CreateUserService) {}

  @Post()
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  createUser(
    @Body() { name, username, email, password }: CreateUserDTO,
  ): Promise<User> {
    return this.createUserService.execute({
      name,
      username,
      email,
      password,
    });
  }
}

export default UserController;
