const userRepositoryMockup = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

const mailerMockup = {
  mailer: {
    sendMail: jest.fn(),
  },
};

const hashPasswordMockup = () => {
  return {
    generateHash: jest.fn(),
  };
};

export { userRepositoryMockup, mailerMockup, hashPasswordMockup };
