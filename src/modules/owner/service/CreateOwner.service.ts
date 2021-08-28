import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ICreateOwnerDTO } from '../models/dto/ICreateOwnerDTO';
import { Owner, OwnerDocument } from '../models/schema/owner.schema';

@Injectable()
export class CreateOwnerService {
  constructor(
    @InjectModel(Owner.name) private ownerModel: Model<OwnerDocument>,
  ) {}

  async execute(owner: ICreateOwnerDTO): Promise<ICreateOwnerDTO> {
    const createOwner = await new this.ownerModel(owner);

    return await createOwner.save();
  }
}
