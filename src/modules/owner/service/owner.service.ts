import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cat, CatDocument } from 'src/modules/cats/models/schema/cat.schema';
import { ICreateOwnerDTO } from '../models/dto/ICreateOwnerDTO';
import { Owner, OwnerDocument } from '../models/schema/owner.schema';

@Injectable()
export class OwnerService {
  constructor(
    @InjectModel(Owner.name) private ownerModel: Model<OwnerDocument>,
    @InjectModel(Cat.name) private catModel: Model<CatDocument>,
  ) {}

  async create(owner: ICreateOwnerDTO): Promise<ICreateOwnerDTO> {
    const createOwner = await new this.ownerModel(owner);

    return await createOwner.save();
  }

  async findAll(): Promise<Array<ICreateOwnerDTO>> {
    return await this.ownerModel.find().exec();
  }

  async findById(id: string): Promise<ICreateOwnerDTO> {
    const owner: ICreateOwnerDTO = await this.ownerModel
      .findOne({ _id: id })
      .exec();

    if (!owner) {
      throw new Error('This Owner referenced not exists in list owner!');
    }

    return await this.ownerModel.findById({ _id: id }).exec();
  }

  async update(id: string, owner: ICreateOwnerDTO): Promise<ICreateOwnerDTO> {
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

  async delete(id: string): Promise<string> {
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
