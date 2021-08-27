import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Owner } from 'src/modules/owner/models/schema/owner.schema';

export type CatDocument = Cat & Document;

@Schema()
export class Cat {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  age: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Owner', required: true })
  owner: Owner | string;
}

export const CatSchema = SchemaFactory.createForClass(Cat);
