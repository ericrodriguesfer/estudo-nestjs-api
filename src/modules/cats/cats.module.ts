import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CreateCatService } from './service/CreateCat.service';
import { DeleteCatService } from './service/DeleteCat.service';
import { ListCatService } from './service/ListCat.service';
import { ListCatOwnerService } from './service/ListCatOwner.service';
import { ListCatsService } from './service/ListCats.service';
import { UpdateCatService } from './service/UpdateCat.service';
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
  providers: [
    CreateCatService,
    DeleteCatService,
    ListCatService,
    ListCatOwnerService,
    ListCatsService,
    UpdateCatService,
  ],
  controllers: [CatsController],
})
export class CatsModule {}
