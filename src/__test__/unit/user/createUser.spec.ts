import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import CreateUserService from '../../../modules/user/services/createUser.service';
import User from '../../../modules/user/infra/typeorm/entities/User';
import SendEmailNewUserService from '../../../modules/mail/services/sendEmailNewUser.service';
import BCryptHash from '../../../modules/user/providers/Hash/implementations/BCryptHash';
import {
  userRepositoryMockup,
  hashPasswordMockup,
  mailerMockup,
} from './mocks/mocksCreateUser';
import { ConflictException } from '@nestjs/common';

describe('Testing the functions of create users', () => {
  let createUserService: CreateUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserService,
        {
          provide: getRepositoryToken(User),
          useValue: userRepositoryMockup,
        },
        {
          provide: BCryptHash,
          useValue: hashPasswordMockup,
        },
        {
          provide: SendEmailNewUserService,
          useValue: mailerMockup,
        },
      ],
    }).compile();

    createUserService = module.get<CreateUserService>(CreateUserService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('Should be able defined create user service', async () => {
    expect(createUserService).toBeDefined();
  });

  it('Should be able create new user with all fields valids', async () => {
    const userCreateInputMock: Omit<User, 'id' | 'created_at' | 'updated_at'> =
      {
        name: 'User Test',
        username: 'usertest',
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

    userRepositoryMockup.create.mockReturnValue(
      Promise.resolve(userCreatedOutputMock),
    );
    userRepositoryMockup.save.mockReturnValue(
      Promise.resolve(userCreatedOutputMock),
    );

    const response = await createUserService.execute({
      name: userCreateInputMock.name,
      username: userCreateInputMock.username,
      email: userCreateInputMock.email,
      password: userCreateInputMock.password,
    });

    expect(response).toEqual(userCreatedOutputMock);
    expect(response).toHaveProperty('id');
    expect(response).toHaveProperty('name');
    expect(response).toHaveProperty('username');
    expect(response).toHaveProperty('email');
    expect(response).toHaveProperty('password');
    expect(response).toHaveProperty('created_at');
    expect(response).toHaveProperty('updated_at');
    expect(response.id).toBe('64282815-b4eb-4a2b-a2f4-0c2689e380a4');
    expect(response.name).toBe('User Test');
    expect(response.username).toBe('usertest');
    expect(response.email).toBe('usertest@gmail.com');
    expect(response.password).toBe(
      '$2a$12$ef9HJafpDSQ13XnxrpuU.Og9O43rbuOnUlFMn6MAU3M2qa0DsQQYi',
    );
    expect(userRepositoryMockup.findOne).toHaveBeenCalled();
    expect(userRepositoryMockup.create).toHaveBeenCalled();
    expect(userRepositoryMockup.save).toHaveBeenCalled();
    expect(mailerMockup.execute).toHaveBeenCalled();
    expect(hashPasswordMockup.generateHash).toHaveBeenCalled();
    expect(userRepositoryMockup.findOne).toHaveBeenCalledTimes(2);
    expect(userRepositoryMockup.create).toHaveBeenCalledTimes(1);
    expect(userRepositoryMockup.save).toHaveBeenCalledTimes(1);
    expect(mailerMockup.execute).toHaveBeenCalledTimes(1);
    expect(hashPasswordMockup.generateHash).toHaveBeenCalledTimes(1);
  });

  it('Should not be able create user with email already in usage for other user', async () => {
    const userCreateInputMock: Omit<User, 'id' | 'created_at' | 'updated_at'> =
      {
        name: 'User Test 2',
        username: 'usertest2',
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

    userRepositoryMockup.findOne.mockReturnValue(
      Promise.resolve(userCreatedOutputMock),
    );

    expect(
      createUserService.execute({
        name: userCreateInputMock.name,
        username: userCreateInputMock.username,
        email: userCreateInputMock.email,
        password: userCreateInputMock.password,
      }),
    ).rejects.toEqual(
      new ConflictException('This email is in usage for other user'),
    );
    expect(userRepositoryMockup.findOne).toHaveBeenCalled();
    expect(userRepositoryMockup.create).not.toHaveBeenCalled();
    expect(userRepositoryMockup.save).not.toHaveBeenCalled();
    expect(mailerMockup.execute).not.toHaveBeenCalled();
    expect(hashPasswordMockup.generateHash).not.toHaveBeenCalled();
    expect(userRepositoryMockup.findOne).toHaveBeenCalledTimes(1);
    expect(userRepositoryMockup.create).toHaveBeenCalledTimes(0);
    expect(userRepositoryMockup.save).toHaveBeenCalledTimes(0);
    expect(mailerMockup.execute).toHaveBeenCalledTimes(0);
    expect(hashPasswordMockup.generateHash).toHaveBeenCalledTimes(0);
  });
});
