import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcryptjs';
import IHash from '../contract/IHash';

@Injectable()
class BCryptHash implements IHash {
  generateHash(payload: string): Promise<string> {
    return hash(payload, 8);
  }

  compareHash(payload: string, hashed: string): Promise<boolean> {
    return compare(payload, hashed);
  }
}

export default BCryptHash;
