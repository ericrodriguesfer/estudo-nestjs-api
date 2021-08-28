import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ICreateOwnerDTO } from 'src/modules/owner/models/dto/ICreateOwnerDTO';
import {
  Owner,
  OwnerDocument,
} from '../../../modules/owner/models/schema/owner.schema';
import { ICreateCatDTO } from '../models/dto/ICreateCatDTO';
import { Cat, CatDocument } from '../models/schema/cat.schema';

@Injectable()
export class ListCatOwnerService {
  constructor(
    @InjectModel(Cat.name) private catModel: Model<CatDocument>,
    @InjectModel(Owner.name) private ownerModel: Model<OwnerDocument>,
  ) {}

  async execute(id: string): Promise<Array<ICreateCatDTO>> {
    const ownerCat: ICreateOwnerDTO = await this.ownerModel
      .findOne({ _id: id })
      .exec();

    if (!ownerCat) {
      throw new Error('This Owner referenced not exists!');
    }

    return await this.catModel.find({ owner: id }).exec();
  }
}
