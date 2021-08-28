import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ICreateOwnerDTO } from '../models/dto/ICreateOwnerDTO';
import { Owner, OwnerDocument } from '../models/schema/owner.schema';

@Injectable()
export class ListOwnersService {
  constructor(
    @InjectModel(Owner.name) private ownerModel: Model<OwnerDocument>,
  ) {}

  async execute(): Promise<Array<ICreateOwnerDTO>> {
    return await this.ownerModel.find().exec();
  }
}
