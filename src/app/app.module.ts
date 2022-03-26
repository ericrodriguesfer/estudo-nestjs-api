import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SendGridModule } from '@ntegral/nestjs-sendgrid';
import { AuthenticateModule } from 'src/modules/authenticate/authenticate.module';
import Token from 'src/modules/authenticate/infra/typeorm/entities/Token';
import { MessagesModule } from 'src/modules/messages/messages.module';
import Breed from 'src/modules/pets/infra/typeorm/entities/Breed';
import Pet from 'src/modules/pets/infra/typeorm/entities/Pet';
import { PetModule } from 'src/modules/pets/pet.module';
import User from 'src/modules/user/infra/typeorm/entities/User';
import { UserModule } from 'src/modules/user/user.module';
import EnsureAuthenticatedMiddleware from 'src/shared/http/middlewares/authenticated.middleware';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: process.env.TYPEORM_CONNECTION as any,
      host: process.env.TYPEORM_HOST,
      port: parseInt(process.env.TYPEORM_PORT),
      username: process.env.TYPEORM_USERNAME,
      password: process.env.TYPEORM_PASSWORD,
      database: process.env.TYPEORM_DATABASE,
      entities: [User, Token, Breed, Pet],
    }),
    SendGridModule.forRoot({
      apiKey: process.env.SENDGRID_API_KEY,
    }),
    UserModule,
    AuthenticateModule,
    PetModule,
    MessagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(EnsureAuthenticatedMiddleware)
      .exclude(
        { method: RequestMethod.POST, path: 'api/session' },
        { method: RequestMethod.POST, path: 'api/session/send-email' },
        { method: RequestMethod.POST, path: 'api/session/send-sms' },
        { method: RequestMethod.POST, path: 'api/session/redefine-password' },
        { method: RequestMethod.POST, path: 'api/user' },
        { method: RequestMethod.GET, path: 'api' },
      )
      .forRoutes('*');
  }
}
