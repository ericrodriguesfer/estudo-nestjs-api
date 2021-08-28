import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cat, CatDocument } from 'src/modules/cats/models/schema/cat.schema';
import { ICreateOwnerDTO } from '../models/dto/ICreateOwnerDTO';
import { Owner, OwnerDocument } from '../models/schema/owner.schema';

@Injectable()
export class DeleteOwnerService {
  constructor(
    @InjectModel(Owner.name) private ownerModel: Model<OwnerDocument>,
    @InjectModel(Cat.name) private catModel: Model<CatDocument>,
  ) {}

  async execute(id: string): Promise<string> {
    const owner: ICreateOwnerDTO = await this.ownerModel
      .findOne({ _id: id })
      .exec();

    if (!owner) {
      throw new Error('This Owner referenced not exists in list owner!');
    }

    await this.catModel.deleteMany({ owner: id }).exec();
    await this.ownerModel.findOneAndDelete({ _id: id }).exec();

    return 'This owner deleted of success!';
  }
}
