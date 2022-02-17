import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import CreateUserService from '../../../../../src/modules/user/services/createUser.service';
import User from '../../../../../src/modules/user/infra/typeorm/entities/User';
import SendEmailNewUserService from '../../../../../src/modules/mail/services/sendEmailNewUser.service';
import BCryptHash from '../../../../../src/modules/user/providers/Hash/implementations/BCryptHash';
import {
  userRepositoryMockup,
  hashPasswordMockup,
  mailerMockup,
} from './mocks/mocksCreateUser';

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
          useFactory: hashPasswordMockup,
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
    const userCreateInput: Omit<User, 'id' | 'created_at' | 'updated_at'> = {
      name: 'User Test',
      username: 'usertest',
      email: 'usertest@gmail.com',
      password: 'qwe123',
    };

    const userCreatedOutput: User = {
      id: '64282815-b4eb-4a2b-a2f4-0c2689e380a4',
      name: 'User Test',
      username: 'usertest',
      email: 'usertest@gmail.com',
      password: 'qwe123',
      created_at: new Date(),
      updated_at: new Date(),
    };

    userRepositoryMockup.create.mockReturnValue(
      Promise.resolve(userCreatedOutput),
    );
    userRepositoryMockup.save.mockReturnValue(
      Promise.resolve(userCreatedOutput),
    );

    const response = await createUserService.execute({
      name: userCreateInput.name,
      username: userCreateInput.username,
      email: userCreateInput.email,
      password: userCreateInput.password,
    });

    expect(response).toEqual(userCreatedOutput);
  });
});
