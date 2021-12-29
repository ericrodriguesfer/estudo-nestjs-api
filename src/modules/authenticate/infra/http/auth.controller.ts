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
import CreateSessionService from '../../services/createSession.service';

@Controller('session')
class AuthController {
  constructor(private authenticateUserService: CreateSessionService) {}

  @Post()
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  createSession(
    @Body() { email, password }: CreateSessionDTO,
  ): Promise<string> {
    return this.authenticateUserService.execute({ email, password });
  }
}

export default AuthController;
