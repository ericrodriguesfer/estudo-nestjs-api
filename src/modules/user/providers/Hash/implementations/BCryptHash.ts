import { Injectable } from '@nestjs/common';
import { hash } from 'bcryptjs';
import IHash from '../contract/IHash';

@Injectable()
class BCryptHash implements IHash {
  generateHash(payload: string): Promise<string> {
    return hash(payload, 8);
  }
}

export default BCryptHash;
