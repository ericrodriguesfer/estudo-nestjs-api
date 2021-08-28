import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ICreateCatDTO } from '../models/dto/ICreateCatDTO';
import { Cat, CatDocument } from '../models/schema/cat.schema';

@Injectable()
export class ListCatsService {
  constructor(@InjectModel(Cat.name) private catModel: Model<CatDocument>) {}

  async execute(): Promise<Array<ICreateCatDTO>> {
    return await this.catModel.find().exec();
  }
}
