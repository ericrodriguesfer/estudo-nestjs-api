import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserController from './infra/http/user.controller';
import User from './infra/typeorm/entities/User';
import BCryptHash from './providers/Hash/implementations/BCryptHash';
import CreateUserService from './services/createUser.service';
import UpdateUserService from './services/updateUser.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [CreateUserService, UpdateUserService, BCryptHash],
})
export class UserModule {}
