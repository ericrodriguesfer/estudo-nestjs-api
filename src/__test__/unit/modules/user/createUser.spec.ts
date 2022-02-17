import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import CreateUserService from '../../../../modules/user/services/createUser.service';
import User from '../../../../modules/user/infra/typeorm/entities/User';
import SendEmailNewUserService from '../../../../modules/mail/services/sendEmailNewUser.service';
import BCryptHash from '../../../../modules/user/providers/Hash/implementations/BCryptHash';
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
  });
});
