import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Owner,
  OwnerDocument,
} from '../../../modules/owner/models/schema/owner.schema';
import { ICreateCatDTO } from '../models/dto/ICreateCatDTO';
import { Cat, CatDocument } from '../models/schema/cat.schema';

@Injectable()
export class UpdateCatService {
  constructor(
    @InjectModel(Cat.name) private catModel: Model<CatDocument>,
    @InjectModel(Owner.name) private ownerModel: Model<OwnerDocument>,
  ) {}

  async execute(id: string, cat: ICreateCatDTO): Promise<ICreateCatDTO> {
    const catSearch: ICreateCatDTO = await this.catModel
      .findOne({ _id: id })
      .exec();

    if (!catSearch) {
      throw new Error('This cat not exists in cat list!');
    }

    const catUpdate: ICreateCatDTO = await this.catModel
      .findOneAndUpdate(
        { _id: id },
        { name: cat.name, age: cat.age },
        { returnOriginal: false },
      )
      .exec();

    return catUpdate;
  }
}
