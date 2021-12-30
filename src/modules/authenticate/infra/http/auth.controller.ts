import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import CreateSessionDTO from '../../dto/CreateSessionDTO';
import SendEmailWithTokenDTO from '../../dto/SendEmailWithTokenDTO';
import CreateSessionService from '../../services/createSession.service';
import SendEmailWithTokenService from '../../services/sendEmailWithToken.service';
import Token from '../typeorm/entities/Token';

@Controller('session')
class AuthController {
  constructor(
    private authenticateUserService: CreateSessionService,
    private sendEmailWithTokenService: SendEmailWithTokenService,
  ) {}

  @Post()
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  createSession(
    @Body() { email, password }: CreateSessionDTO,
  ): Promise<string> {
    return this.authenticateUserService.execute({ email, password });
  }

  @Post('send-email')
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  sendEmailWithToken(@Body() { email }: SendEmailWithTokenDTO): Promise<Token> {
    return this.sendEmailWithTokenService.execute({ email });
  }
}

export default AuthController;
