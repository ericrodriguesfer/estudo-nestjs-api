import { Injectable } from '@nestjs/common';
import { compare } from 'bcryptjs';
import IHashPasswordContract from '../contract/IHash';

@Injectable()
class BCryptHashPassword implements IHashPasswordContract {
  compareHash(payload: string, hashed: string): Promise<boolean> {
    return compare(payload, hashed);
  }
}

export default BCryptHashPassword;
