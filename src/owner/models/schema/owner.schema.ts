import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OwnerDocument = Owner & Document;

@Schema()
export class Owner {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;
}

export const OwnerSchema = SchemaFactory.createForClass(Owner);
