import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ICreateOwnerDTO } from '../models/dto/ICreateOwnerDTO';
import { Owner, OwnerDocument } from '../models/schema/owner.schema';

@Injectable()
export class UpdateOwnerService {
  constructor(
    @InjectModel(Owner.name) private ownerModel: Model<OwnerDocument>,
  ) {}

  async execute(id: string, owner: ICreateOwnerDTO): Promise<ICreateOwnerDTO> {
    const ownerSearch: ICreateOwnerDTO = await this.ownerModel
      .findOne({ _id: id })
      .exec();

    if (!ownerSearch) {
      throw new Error('This Owner referenced not exists in list owner!');
    }

    const ownerUpdate: ICreateOwnerDTO = await this.ownerModel
      .findOneAndUpdate(
        { _id: id },
        { name: owner.name, email: owner.email },
        { returnOriginal: false },
      )
      .exec();

    return ownerUpdate;
  }
}
