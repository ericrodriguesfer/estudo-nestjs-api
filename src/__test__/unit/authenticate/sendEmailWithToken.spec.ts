import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import Token from '../../../modules/authenticate/infra/typeorm/entities/Token';
import SendEmailWithTokenService from '../../../modules/authenticate/services/sendEmailWithToken.service';
import SendEmailWithTokenForRecoverPasswordService from '../../../modules/mail/services/sendEmailWithTokenForRecoverPassword.service';
import User from '../../../modules/user/infra/typeorm/entities/User';
import {
  mailerMockup,
  tokenRepositoryMockup,
  userRepositoryMockup,
} from './mocks/mocksSendEmailWithToken';

describe('Testing the functions of send email with token for recover password of users', () => {
  let sendEmailWithTokenService: SendEmailWithTokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SendEmailWithTokenService,
        {
          provide: getRepositoryToken(User),
          useValue: userRepositoryMockup,
        },
        {
          provide: getRepositoryToken(Token),
          useValue: tokenRepositoryMockup,
        },
        {
          provide: SendEmailWithTokenForRecoverPasswordService,
          useValue: mailerMockup,
        },
      ],
    }).compile();

    sendEmailWithTokenService = module.get<SendEmailWithTokenService>(
      SendEmailWithTokenService,
    );
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('Should be able defined send email with token service', async () => {
    expect(sendEmailWithTokenService).toBeDefined();
  });

  it('Should be able send a email with token of recover password when the email repassed exists in database', async () => {
    const emailRequestedToken = 'usertest@gmail.com';
    const userCreatedOutputMock: User = {
      id: '64282815-b4eb-4a2b-a2f4-0c2689e380a4',
      name: 'User Test',
      username: 'usertest',
      email: 'usertest@gmail.com',
      password: '$2a$12$ef9HJafpDSQ13XnxrpuU.Og9O43rbuOnUlFMn6MAU3M2qa0DsQQYi',
      phone: '+5585955555555',
      created_at: new Date(),
      updated_at: new Date(),
    };

    const createTokenOutoutMock: Token = {
      id: '64282815-b4eb-4a2b-a2f4-0c2689e380a3',
      token: '64282815-b4eb-4a2b-a2f4-0c2689e380a5',
      used: false,
      user_id: userCreatedOutputMock.id,
      user: userCreatedOutputMock,
      used_in: null,
      expires: new Date('2022/03/03'),
      created_at: new Date(),
      updated_at: new Date(),
    };

    userRepositoryMockup.findOne.mockReturnValue(
      Promise.resolve(userCreatedOutputMock),
    );
    tokenRepositoryMockup.findOne.mockReturnValue(
      Promise.resolve(createTokenOutoutMock),
    );
    tokenRepositoryMockup.create.mockReturnValue(
      Promise.resolve(createTokenOutoutMock),
    );
    tokenRepositoryMockup.save.mockReturnValue(
      Promise.resolve(createTokenOutoutMock),
    );

    const response = await sendEmailWithTokenService.execute({
      email: emailRequestedToken,
    });

    expect(response).toEqual(createTokenOutoutMock);
    expect(response).toHaveProperty('id');
    expect(response).toHaveProperty('token');
    expect(response).toHaveProperty('used');
    expect(response).toHaveProperty('user_id');
    expect(response).toHaveProperty('user');
    expect(response).toHaveProperty('used_in');
    expect(response).toHaveProperty('expires');
    expect(response).toHaveProperty('created_at');
    expect(response).toHaveProperty('updated_at');
    expect(response.id).toBe(createTokenOutoutMock.id);
    expect(response.token).toBe(createTokenOutoutMock.token);
    expect(response.used).toBe(createTokenOutoutMock.used);
    expect(response.user_id).toBe(createTokenOutoutMock.user_id);
    expect(response.user).toBe(createTokenOutoutMock.user);
    expect(response.used_in).toBe(createTokenOutoutMock.used_in);
    expect(response.expires).toBe(createTokenOutoutMock.expires);
    expect(response.created_at).toBe(createTokenOutoutMock.created_at);
    expect(response.updated_at).toBe(createTokenOutoutMock.updated_at);
    expect(userRepositoryMockup.findOne).toHaveBeenCalled();
    expect(tokenRepositoryMockup.save).not.toHaveBeenCalled();
    expect(tokenRepositoryMockup.create).not.toHaveBeenCalled();
    expect(mailerMockup.execute).toHaveBeenCalled();
    expect(userRepositoryMockup.findOne).toHaveBeenCalledTimes(1);
    expect(tokenRepositoryMockup.findOne).toHaveBeenCalledTimes(1);
    expect(tokenRepositoryMockup.save).toHaveBeenCalledTimes(0);
    expect(tokenRepositoryMockup.create).toHaveBeenCalledTimes(0);
    expect(mailerMockup.execute).toHaveBeenCalledTimes(1);
  });
  it('Should not be able send a email with token of recover password because the email repassed does not exists in database', async () => {
    const emailRequestedToken = 'usertest@gmail.com';

    userRepositoryMockup.findOne.mockReturnValue(Promise.resolve());

    expect(
      sendEmailWithTokenService.execute({
        email: emailRequestedToken,
      }),
    ).rejects.toEqual(
      new NotFoundException('This user does not exists in database'),
    );
    expect(userRepositoryMockup.findOne).toHaveBeenCalled();
    expect(tokenRepositoryMockup.save).not.toHaveBeenCalled();
    expect(tokenRepositoryMockup.create).not.toHaveBeenCalled();
    expect(mailerMockup.execute).not.toHaveBeenCalled();
    expect(userRepositoryMockup.findOne).toHaveBeenCalledTimes(1);
    expect(tokenRepositoryMockup.save).toHaveBeenCalledTimes(0);
    expect(tokenRepositoryMockup.create).toHaveBeenCalledTimes(0);
    expect(mailerMockup.execute).toHaveBeenCalledTimes(0);
  });
});
