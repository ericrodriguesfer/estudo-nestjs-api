import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Cat, CatSchema } from 'src/cats/models/schema/cat.schema';
import { OwnerController } from './controller/owner.controller';
import { Owner, OwnerSchema } from './models/schema/owner.schema';
import { OwnerService } from './service/owner.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Owner.name, schema: OwnerSchema },
      { name: Cat.name, schema: CatSchema },
    ]),
  ],
  controllers: [OwnerController],
  providers: [OwnerService],
})
export class OwnerModule {}
