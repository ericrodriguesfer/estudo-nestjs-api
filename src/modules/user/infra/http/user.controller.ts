import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Param,
  Post,
  Put,
  Request,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import CreateUserDTO from '../../dto/CreateUserDTO';
import IRequestUser from '../../dto/IRequestUser';
import UpdateUserDTO from '../../dto/UpdateUserDTO';
import CreateUserService from '../../services/createUser.service';
import UpdateUserService from '../../services/updateUser.service';
import User from '../typeorm/entities/User';

@Controller('user')
class UserController {
  constructor(
    private createUserService: CreateUserService,
    private updateUserService: UpdateUserService,
  ) {}

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

  @Put(':id')
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  updateUser(
    // @Request() request: IRequestUser,
    @Param('id') id: string,
    @Body() { name, username, email, password }: UpdateUserDTO,
  ): Promise<User> {
    return this.updateUserService.execute(id, {
      name,
      username,
      email,
      password,
    });
  }
}

export default UserController;
