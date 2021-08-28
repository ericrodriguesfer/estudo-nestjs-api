import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ICreateCatDTO } from '../models/dto/ICreateCatDTO';
import { Cat, CatDocument } from '../models/schema/cat.schema';

@Injectable()
export class ListCatService {
  constructor(@InjectModel(Cat.name) private catModel: Model<CatDocument>) {}

  async execute(id: string): Promise<ICreateCatDTO> {
    const cat: ICreateCatDTO = await this.catModel.findOne({ _id: id }).exec();

    if (!cat) {
      throw new Error('This cat not exists in cat list!');
    }

    return cat;
  }
}
