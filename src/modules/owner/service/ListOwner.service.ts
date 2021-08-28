import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ICreateOwnerDTO } from '../models/dto/ICreateOwnerDTO';
import { Owner, OwnerDocument } from '../models/schema/owner.schema';

@Injectable()
export class ListOwnerService {
  constructor(
    @InjectModel(Owner.name) private ownerModel: Model<OwnerDocument>,
  ) {}

  async execute(id: string): Promise<ICreateOwnerDTO> {
    const owner: ICreateOwnerDTO = await this.ownerModel
      .findOne({ _id: id })
      .exec();

    if (!owner) {
      throw new Error('This Owner referenced not exists in list owner!');
    }

    return await this.ownerModel.findById({ _id: id }).exec();
  }
}
