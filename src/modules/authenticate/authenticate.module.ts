import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { expiresIn, secret } from 'src/config/jwt/config.jwt';
import { MailModule } from '../mail/mail.module';
import User from '../user/infra/typeorm/entities/User';
import AuthController from './infra/http/auth.controller';
import Token from './infra/typeorm/entities/Token';
import BCryptHashPassword from './providers/Hash/implementations/BCryptHashPassword';
import CreateSessionService from './services/createSession.service';
import RedefinePasswordService from './services/redefinePassword.service';
import SendEmailWithTokenService from './services/sendEmailWithToken.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([User, Token]),
    MailModule,
    JwtModule.register({
      secret: secret,
      signOptions: { expiresIn: expiresIn },
    }),
  ],
  controllers: [AuthController],
  providers: [
    CreateSessionService,
    SendEmailWithTokenService,
    RedefinePasswordService,
    BCryptHashPassword,
  ],
})
export class AuthenticateModule {}
