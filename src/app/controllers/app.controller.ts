import { Controller, Get } from '@nestjs/common';
import IReponseDefaultRoute from '../contract/IResponseDefaultRoute';
import { AppService } from '../services/app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): IReponseDefaultRoute {
    return this.appService.getHello();
  }
}
