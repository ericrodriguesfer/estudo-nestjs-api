import { Injectable } from '@nestjs/common';
import IReponseDefaultRoute from '../contract/IResponseDefaultRoute';

@Injectable()
export class AppService {
  getHello(): IReponseDefaultRoute {
    return { message: 'Wellcome a study creation of api with NestJs!' };
  }
}
