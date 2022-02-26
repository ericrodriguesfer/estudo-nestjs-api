const userRepositoryMockup = {
  findOne: jest.fn(),
  merge: jest.fn(),
  save: jest.fn(),
};

const tokenRepositoryMockup = {
  findOne: jest.fn(),
  find: jest.fn(),
  merge: jest.fn(),
  save: jest.fn(),
};

const mailerMockup = {
  execute: jest.fn().mockImplementation(),
};

const hashPasswordMockup = {
  compareHash: jest.fn(),
  generateHash: jest
    .fn()
    .mockReturnValue(
      Promise.resolve(
        '$2a$12$ef9HJafpDSQ13XnxrpuU.Og9O43rbuOnUlFMn6MAU3M2qa0DsQQYi',
      ),
    ),
};

export {
  userRepositoryMockup,
  tokenRepositoryMockup,
  mailerMockup,
  hashPasswordMockup,
};
