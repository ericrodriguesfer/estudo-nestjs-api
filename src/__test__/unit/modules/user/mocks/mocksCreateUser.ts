const userRepositoryMockup = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

const mailerMockup = {
  execute: jest.fn().mockImplementation(() => Promise.resolve()),
};

const hashPasswordMockup = () => {
  return {
    generateHash: jest.fn(),
  };
};

export { userRepositoryMockup, mailerMockup, hashPasswordMockup };
