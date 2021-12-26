import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { expiresIn, secret } from 'src/config/jwt/config.jwt';
import EnsureAuthenticatedMiddleware from 'src/shared/http/middlewares/authenticated.middleware';
import UserController from './infra/http/user.controller';
import User from './infra/typeorm/entities/User';
import BCryptHash from './providers/Hash/implementations/BCryptHash';
import CreateUserService from './services/createUser.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: secret,
      signOptions: { expiresIn: expiresIn },
    }),
  ],
  controllers: [UserController],
  providers: [CreateUserService, BCryptHash],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(EnsureAuthenticatedMiddleware)
      .exclude({ method: RequestMethod.POST, path: 'api/user' })
      .forRoutes('*');
  }
}
