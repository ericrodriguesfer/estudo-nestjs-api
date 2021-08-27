import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CatsService } from './service/cats.service';
import { CatsController } from './controller/cats.controller';
import { Cat, CatSchema } from './models/schema/cat.schema';
import {
  Owner,
  OwnerSchema,
} from '../../modules/owner/models/schema/owner.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cat.name, schema: CatSchema },
      { name: Owner.name, schema: OwnerSchema },
    ]),
  ],
  providers: [CatsService],
  controllers: [CatsController],
})
export class CatsModule {}
