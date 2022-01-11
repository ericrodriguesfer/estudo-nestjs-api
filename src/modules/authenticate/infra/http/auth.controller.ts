import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import User from 'src/modules/user/infra/typeorm/entities/User';
import CreateSessionDTO from '../../dto/CreateSessionDTO';
import RedefinePasswordDTO from '../../dto/RedefinePasswordDTO';
import SendEmailWithTokenDTO from '../../dto/SendEmailWithTokenDTO';
import CreateSessionService from '../../services/createSession.service';
import RedefinePasswordService from '../../services/redefinePassword.service';
import SendEmailWithTokenService from '../../services/sendEmailWithToken.service';
import Token from '../typeorm/entities/Token';

@Controller('session')
class AuthController {
  constructor(
    private authenticateUserService: CreateSessionService,
    private sendEmailWithTokenService: SendEmailWithTokenService,
    private redefinePasswordService: RedefinePasswordService,
  ) {}

  @Post()
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBody({ type: CreateSessionDTO })
  createSession(
    @Body() { email, password }: CreateSessionDTO,
  ): Promise<string> {
    return this.authenticateUserService.execute({ email, password });
  }

  @Post('send-email')
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBody({ type: SendEmailWithTokenDTO })
  sendEmailWithToken(@Body() { email }: SendEmailWithTokenDTO): Promise<Token> {
    return this.sendEmailWithTokenService.execute({ email });
  }

  @Post('redefine-password')
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBody({ type: RedefinePasswordDTO })
  redefinePassword(
    @Body() { token, password, confirmPassword }: RedefinePasswordDTO,
  ): Promise<User> {
    return this.redefinePasswordService.execute({
      token,
      password,
      confirmPassword,
    });
  }
}

export default AuthController;
