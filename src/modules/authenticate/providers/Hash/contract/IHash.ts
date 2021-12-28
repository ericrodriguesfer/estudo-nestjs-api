interface IHashPasswordContract {
  compareHash(payload: string, hashed: string): Promise<boolean>;
}

export default IHashPasswordContract;
