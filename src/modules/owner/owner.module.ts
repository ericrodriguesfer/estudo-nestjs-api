import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Cat, CatSchema } from 'src/modules/cats/models/schema/cat.schema';
import { OwnerController } from './controller/owner.controller';
import { Owner, OwnerSchema } from './models/schema/owner.schema';
import { CreateOwnerService } from './service/CreateOwner.service';
import { ListOwnerService } from './service/ListOwner.service';
import { ListOwnersService } from './service/ListOwners.service';
import { UpdateOwnerService } from './service/UpdateOwner.service';
import { DeleteOwnerService } from './service/DeleteOwner.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Owner.name, schema: OwnerSchema },
      { name: Cat.name, schema: CatSchema },
    ]),
  ],
  controllers: [OwnerController],
  providers: [
    CreateOwnerService,
    ListOwnerService,
    ListOwnersService,
    UpdateOwnerService,
    DeleteOwnerService,
  ],
})
export class OwnerModule {}
