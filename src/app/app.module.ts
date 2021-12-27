import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { UserModule } from 'src/modules/user/user.module';
import { AuthenticateModule } from 'src/modules/authenticate/authenticate.module';
import { PetModule } from 'src/modules/pets/pet.module';
import User from 'src/modules/user/infra/typeorm/entities/User';
import EnsureAuthenticatedMiddleware from 'src/shared/http/middlewares/authenticated.middleware';

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
      entities: [User],
    }),
    UserModule,
    AuthenticateModule,
    PetModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(EnsureAuthenticatedMiddleware)
      .exclude(
        { method: RequestMethod.GET, path: 'api' },
        { method: RequestMethod.POST, path: 'api/user' },
      )
      .forRoutes('*');
  }
}
