interface IHashPasswordContract {
  compareHash(payload: string, hashed: string): Promise<boolean>;
  generateHash(payload: string): Promise<string>;
}

export default IHashPasswordContract;
