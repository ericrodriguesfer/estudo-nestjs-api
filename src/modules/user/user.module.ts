import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { expiresIn, secret } from 'src/config/jwt/config.jwt';
import UserController from './infra/http/user.controller';
import User from './infra/typeorm/entities/User';
import BCryptHash from './providers/Hash/implementations/BCryptHash';
import CreateUserService from './services/createUser.service';
import UpdateUserService from './services/updateUser.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: secret,
      signOptions: { expiresIn: expiresIn },
    }),
  ],
  controllers: [UserController],
  providers: [CreateUserService, UpdateUserService, BCryptHash],
})
export class UserModule {}
