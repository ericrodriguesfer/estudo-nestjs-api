import { Owner } from 'src/owner/models/schema/owner.schema';

export interface CreateCat {
  name: string;
  age: number;
  owner: Owner | string;
}
