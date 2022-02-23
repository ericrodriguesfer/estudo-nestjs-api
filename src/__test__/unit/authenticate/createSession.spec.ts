import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import BCryptHashPassword from '../../../modules/authenticate/providers/Hash/implementations/BCryptHashPassword';
import User from '../../../modules/user/infra/typeorm/entities/User';
import CreateSessionService from '../../../modules/authenticate/services/createSession.service';
import {
  hashPasswordMockup,
  jwtServiceMockup,
  userRepositoryMockup,
} from './mocks/mocksCreateSession';
import { JwtService } from '@nestjs/jwt';
import CreateSessionDTO from '../../../modules/authenticate/dto/CreateSessionDTO';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

describe('Testing the functions of authenticating for create sessions of users', () => {
  let createSessionService: CreateSessionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateSessionService,
        {
          provide: getRepositoryToken(User),
          useValue: userRepositoryMockup,
        },
        {
          provide: BCryptHashPassword,
          useValue: hashPasswordMockup,
        },
        {
          provide: JwtService,
          useValue: jwtServiceMockup,
        },
      ],
    }).compile();

    createSessionService =
      module.get<CreateSessionService>(CreateSessionService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('Should be able defined create session of user service', async () => {
    expect(createSessionService).toBeDefined();
  });

  it('Should be able create valid session when email and password repassed are valids', async () => {
    const createSessionDataInputMock: CreateSessionDTO = {
      email: 'usertest@gmail.com',
      password: 'qwe123',
    };
    const jwtSignReturnOutputMock =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjBhMGZiOTQ0LTdmZDAtNDBlNC1hMDQxLTBkYzhhZDkxNjdmMyIsIm5hbWUiOiJFcmljIFJvZHJpZ3VlcyIsInVzZXJuYW1lIjoiZXJpY3JvZHJpZ3VlcyIsImVtYWlsIjoiZXJpYy5yb2RyaWd1ZXNAaW5zaWdodGxhYi51ZmMuYnIiLCJpYXQiOjE2NDIzNjQ5NDQsImV4cCI6MTY0Mjk2OTc0NH0.heypjQneYsy1VbCY-KK2A-Ch0MKXQlD6ou0LmKbvQZg';
    const userCreatedOutputMock: User = {
      id: '64282815-b4eb-4a2b-a2f4-0c2689e380a4',
      name: 'User Test',
      username: 'usertest',
      email: 'usertest@gmail.com',
      password: '$2a$12$ef9HJafpDSQ13XnxrpuU.Og9O43rbuOnUlFMn6MAU3M2qa0DsQQYi',
      created_at: new Date(),
      updated_at: new Date(),
    };

    userRepositoryMockup.findOne.mockReturnValueOnce(
      Promise.resolve(userCreatedOutputMock),
    );
    hashPasswordMockup.compareHash.mockReturnValueOnce(Promise.resolve(true));

    const response = await createSessionService.execute({
      email: createSessionDataInputMock.email,
      password: createSessionDataInputMock.password,
    });

    expect(response).toEqual(jwtSignReturnOutputMock);
    expect(response).toBe(jwtSignReturnOutputMock);
    expect(userRepositoryMockup.findOne).toHaveBeenCalled();
    expect(hashPasswordMockup.compareHash).toHaveBeenCalled();
    expect(jwtServiceMockup.sign).toHaveBeenCalled();
    expect(userRepositoryMockup.findOne).toHaveBeenCalledTimes(1);
    expect(hashPasswordMockup.compareHash).toHaveBeenCalledTimes(1);
    expect(jwtServiceMockup.sign).toHaveBeenCalledTimes(1);
  });

  it('Should not be able create valid session because user not exists in database', async () => {
    const createSessionDataInputMock: CreateSessionDTO = {
      email: 'usertest@gmail.com',
      password: 'qwe123',
    };

    userRepositoryMockup.findOne.mockReturnValueOnce(Promise.resolve());

    expect(
      createSessionService.execute({
        email: createSessionDataInputMock.email,
        password: createSessionDataInputMock.password,
      }),
    ).rejects.toEqual(
      new NotFoundException('This user does not exists in database'),
    );
    expect(userRepositoryMockup.findOne).toHaveBeenCalled();
    expect(hashPasswordMockup.compareHash).not.toHaveBeenCalled();
    expect(jwtServiceMockup.sign).not.toHaveBeenCalled();
    expect(userRepositoryMockup.findOne).toHaveBeenCalledTimes(1);
    expect(hashPasswordMockup.compareHash).toHaveBeenCalledTimes(0);
    expect(jwtServiceMockup.sign).toHaveBeenCalledTimes(0);
  });

  it('Should not be able create valid session because the password not combine whit the of database', async () => {
    const createSessionDataInputMock: CreateSessionDTO = {
      email: 'usertest@gmail.com',
      password: 'qwe123',
    };
    const userCreatedOutputMock: User = {
      id: '64282815-b4eb-4a2b-a2f4-0c2689e380a4',
      name: 'User Test',
      username: 'usertest',
      email: 'usertest@gmail.com',
      password: '$2a$12$ef9HJafpDSQ13XnxrpuU.Og9O43rbuOnUlFMn6MAU3M2qa0DsQQYi',
      created_at: new Date(),
      updated_at: new Date(),
    };

    userRepositoryMockup.findOne.mockReturnValueOnce(
      Promise.resolve(userCreatedOutputMock),
    );
    hashPasswordMockup.compareHash.mockReturnValueOnce(Promise.resolve(false));

    expect(
      createSessionService.execute({
        email: createSessionDataInputMock.email,
        password: createSessionDataInputMock.password,
      }),
    ).rejects.toEqual(
      new UnauthorizedException('This password repassed does not match'),
    );
    expect(userRepositoryMockup.findOne).toHaveBeenCalled();
    expect(hashPasswordMockup.compareHash).not.toHaveBeenCalled();
    expect(jwtServiceMockup.sign).not.toHaveBeenCalled();
    expect(userRepositoryMockup.findOne).toHaveBeenCalledTimes(1);
    expect(hashPasswordMockup.compareHash).toHaveBeenCalledTimes(0);
    expect(jwtServiceMockup.sign).toHaveBeenCalledTimes(0);
  });
});
