import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcryptjs';
import IHashPasswordContract from '../contract/IHashPasswordContract';

@Injectable()
class BCryptHashPassword implements IHashPasswordContract {
  compareHash(payload: string, hashed: string): Promise<boolean> {
    return compare(payload, hashed);
  }

  generateHash(payload: string): Promise<string> {
    return hash(payload, 8);
  }
}

export default BCryptHashPassword;
