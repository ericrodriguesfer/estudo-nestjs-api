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
export class DeleteCatService {
  constructor(
    @InjectModel(Cat.name) private catModel: Model<CatDocument>,
    @InjectModel(Owner.name) private ownerModel: Model<OwnerDocument>,
  ) {}

  async execute(id: string): Promise<string> {
    const cat: ICreateCatDTO = await this.catModel.findOne({ _id: id }).exec();

    if (!cat) {
      throw new Error('This cat not exists in cat list!');
    }

    await this.catModel.findOneAndDelete({ _id: id }).exec();

    return 'This cat deleted of success!';
  }
}
