import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { expiresIn, secret } from 'src/config/jwt/config.jwt';
import User from '../user/infra/typeorm/entities/User';
import AuthController from './infra/http/auth.controller';
import BCryptHashPassword from './providers/Hash/implementations/BCryptHashPassword';
import CreateSessionService from './services/createSession.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: secret,
      signOptions: { expiresIn: expiresIn },
    }),
  ],
  controllers: [AuthController],
  providers: [CreateSessionService, BCryptHashPassword],
})
export class AuthenticateModule {}
