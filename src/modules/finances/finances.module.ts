import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import FinancesController from './infra/http/finances.controller';

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forFeature([])],
  controllers: [FinancesController],
  providers: [],
})
export class FinancesModule {}
