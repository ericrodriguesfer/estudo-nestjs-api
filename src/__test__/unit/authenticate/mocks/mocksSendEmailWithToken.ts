const userRepositoryMockup = {
  findOne: jest.fn(),
};

const tokenRepositoryMockup = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

const mailerMockup = {
  execute: jest.fn().mockImplementation(),
};

export { userRepositoryMockup, tokenRepositoryMockup, mailerMockup };
