import { Owner } from 'src/modules/owner/models/schema/owner.schema';

export interface ICreateCatDTO {
  name: string;
  age: number;
  owner: Owner | string;
}
