import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Put,
  Request,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import CreateUserDTO from '../../dto/CreateUserDTO';
import IRequestUser from '../../dto/IRequestUser';
import UpdateUserDTO from '../../dto/UpdateUserDTO';
import CreateUserService from '../../services/createUser.service';
import GetMeDataService from '../../services/getMeData.service';
import UpdateUserService from '../../services/updateUser.service';
import User from '../typeorm/entities/User';

@Controller('user')
class UserController {
  constructor(
    private createUserService: CreateUserService,
    private updateUserService: UpdateUserService,
    private getMeDataService: GetMeDataService,
  ) {}

  @Get('me')
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  getMe(@Request() request: IRequestUser): Promise<User> {
    return this.getMeDataService.execute({ email: request.user.email });
  }

  @Post()
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBody({ type: CreateUserDTO })
  createUser(
    @Body() { name, username, email, password, phone }: CreateUserDTO,
  ): Promise<User> {
    return this.createUserService.execute({
      name,
      username,
      email,
      password,
      phone,
    });
  }

  @Put()
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBody({ type: UpdateUserDTO })
  @ApiBearerAuth()
  updateUser(
    @Request() request: IRequestUser,
    @Body() { name, username, email, password, phone }: UpdateUserDTO,
  ): Promise<User> {
    return this.updateUserService.execute(request.user.id, {
      name,
      username,
      email,
      password,
      phone,
    });
  }
}

export default UserController;
