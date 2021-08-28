import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ICreateOwnerDTO } from 'src/modules/owner/models/dto/ICreateOwnerDTO';
import { Owner, OwnerDocument } from '../../owner/models/schema/owner.schema';
import { ICreateCatDTO } from '../models/dto/ICreateCatDTO';
import { Cat, CatDocument } from '../models/schema/cat.schema';

@Injectable()
export class CreateCatService {
  constructor(
    @InjectModel(Cat.name) private catModel: Model<CatDocument>,
    @InjectModel(Owner.name) private ownerModel: Model<OwnerDocument>,
  ) {}

  async execute(cat: ICreateCatDTO): Promise<ICreateCatDTO> {
    const ownerCat: ICreateOwnerDTO = await this.ownerModel
      .findOne({ _id: cat.owner })
      .exec();

    if (!ownerCat) {
      throw new Error('This Owner referenced not exists!');
    }

    const createdCat = await new this.catModel(cat);
    return await createdCat.save();
  }
}
