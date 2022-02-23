const userRepositoryMockup = {
  findOne: jest.fn(),
};

const hashPasswordMockup = {
  compareHash: jest.fn(),
};

const jwtServiceMockup = {
  sign: jest
    .fn()
    .mockReturnValueOnce(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjBhMGZiOTQ0LTdmZDAtNDBlNC1hMDQxLTBkYzhhZDkxNjdmMyIsIm5hbWUiOiJFcmljIFJvZHJpZ3VlcyIsInVzZXJuYW1lIjoiZXJpY3JvZHJpZ3VlcyIsImVtYWlsIjoiZXJpYy5yb2RyaWd1ZXNAaW5zaWdodGxhYi51ZmMuYnIiLCJpYXQiOjE2NDIzNjQ5NDQsImV4cCI6MTY0Mjk2OTc0NH0.heypjQneYsy1VbCY-KK2A-Ch0MKXQlD6ou0LmKbvQZg',
    ),
};

export { userRepositoryMockup, hashPasswordMockup, jwtServiceMockup };
