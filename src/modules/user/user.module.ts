import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserController from './infra/http/user.controller';
import User from './infra/typeorm/entities/User';
import BCryptHash from './providers/Hash/implementations/BCryptHash';
import CreateUserService from './services/createUser.service';
import GetMeDataService from './services/getMeData.service';
import UpdateUserService from './services/updateUser.service';

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [
    CreateUserService,
    UpdateUserService,
    GetMeDataService,
    BCryptHash,
  ],
})
export class UserModule {}
