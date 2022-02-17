import { Test, TestingModule } from '@nestjs/testing';
import CreateUserService from '../../../../modules/user/services/createUser.service';
import User from '../../../../modules/user/infra/typeorm/entities/User';
import { getRepositoryToken } from '@nestjs/typeorm';
import SendEmailNewUserService from '../../../../modules/mail/services/sendEmailNewUser.service';
import BCryptHash from '../../../../modules/user/providers/Hash/implementations/BCryptHash';
import { Repository } from 'typeorm';
import {
  userRepositoryMockup,
  hashPasswordMockup,
  mailerMockup,
} from './mocks/mocksCreateUser';

describe('Testing the functions of create users', () => {
  let userRepository: Repository<User>;
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

    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    createUserService = module.get<CreateUserService>(CreateUserService);
  });

  it('Should be able defined create user service', () => {
    expect(createUserService).toBeDefined();
  });
});
