import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SendGridModule } from '@ntegral/nestjs-sendgrid';
import UserController from './infra/http/user.controller';
import User from './infra/typeorm/entities/User';
import BCryptHash from './providers/Hash/implementations/BCryptHash';
import CreateUserService from './services/createUser.service';
import UpdateUserService from './services/updateUser.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([User]),
    SendGridModule.forRoot({
      apiKey: process.env.SENDGRID_API_KEY,
    }),
  ],
  controllers: [UserController],
  providers: [CreateUserService, UpdateUserService, BCryptHash],
})
export class UserModule {}
