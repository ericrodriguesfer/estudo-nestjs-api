interface IHash {
  generateHash(payload: string): Promise<string>;
}

export default IHash;
