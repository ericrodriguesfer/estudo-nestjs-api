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
export class CatsService {
  constructor(
    @InjectModel(Cat.name) private catModel: Model<CatDocument>,
    @InjectModel(Owner.name) private ownerModel: Model<OwnerDocument>,
  ) {}

  async create(cat: ICreateCatDTO): Promise<ICreateCatDTO> {
    const ownerCat: ICreateOwnerDTO = await this.ownerModel
      .findOne({ _id: cat.owner })
      .exec();

    if (!ownerCat) {
      throw new Error('This Owner referenced not exists!');
    }

    const createdCat = await new this.catModel(cat);
    return await createdCat.save();
  }

  async findAll(): Promise<Array<ICreateCatDTO>> {
    return await this.catModel.find().exec();
  }

  async findById(id: string): Promise<ICreateCatDTO> {
    const cat: ICreateCatDTO = await this.catModel.findOne({ _id: id }).exec();

    if (!cat) {
      throw new Error('This cat not exists in cat list!');
    }

    return cat;
  }

  async findByOwner(id: string): Promise<Array<ICreateCatDTO>> {
    const ownerCat: ICreateOwnerDTO = await this.ownerModel
      .findOne({ _id: id })
      .exec();

    if (!ownerCat) {
      throw new Error('This Owner referenced not exists!');
    }

    return await this.catModel.find({ owner: id }).exec();
  }

  async update(id: string, cat: ICreateCatDTO): Promise<ICreateCatDTO> {
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

  async delete(id: string): Promise<string> {
    const cat: ICreateCatDTO = await this.catModel.findOne({ _id: id }).exec();

    if (!cat) {
      throw new Error('This cat not exists in cat list!');
    }

    await this.catModel.findOneAndDelete({ _id: id }).exec();

    return 'This cat deleted of success!';
  }
}
