import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import User from '../../../modules/user/infra/typeorm/entities/User';
import Token from '../../../modules/authenticate/infra/typeorm/entities/Token';
import RedefinePasswordService from '../../../modules/authenticate/services/redefinePassword.service';
import {
  hashPasswordMockup,
  mailerMockup,
  tokenRepositoryMockup,
  userRepositoryMockup,
} from './mocks/mocksRedefinePassword';
import BCryptHashPassword from '../../../modules/authenticate/providers/Hash/implementations/BCryptHashPassword';
import SendEmailConfirmRecoverPasswordService from '../../../modules/mail/services/sendEmailConfirmRecoverPassword.service';
import RedefinePasswordDTO from 'src/modules/authenticate/dto/RedefinePasswordDTO';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

describe('Testing the functions of recover password of user', () => {
  let recoverPasswordService: RedefinePasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedefinePasswordService,
        {
          provide: getRepositoryToken(User),
          useValue: userRepositoryMockup,
        },
        {
          provide: getRepositoryToken(Token),
          useValue: tokenRepositoryMockup,
        },
        {
          provide: BCryptHashPassword,
          useValue: hashPasswordMockup,
        },
        {
          provide: SendEmailConfirmRecoverPasswordService,
          useValue: mailerMockup,
        },
      ],
    }).compile();

    recoverPasswordService = module.get<RedefinePasswordService>(
      RedefinePasswordService,
    );
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('Should be able defined recover password service', async () => {
    expect(recoverPasswordService).toBeDefined();
  });

  it('Should be able update the password of user when he repassed a token valid and new password valid', async () => {
    const userCreatedOutputMock: User = {
      id: '64282815-b4eb-4a2b-a2f4-0c2689e380a4',
      name: 'User Test',
      username: 'usertest',
      email: 'usertest@gmail.com',
      password: '$2a$12$ef9HJafpDSQ13XnxrpuU.Og9O43rbuOnUlFMn6MAU3M2qa0DsQQYi',
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

    const dataPasswordUpdate: RedefinePasswordDTO = {
      token: createTokenOutoutMock.token,
      password: 'qwe123',
      confirmPassword: 'qwe123',
    };

    tokenRepositoryMockup.findOne.mockReturnValue(
      Promise.resolve(createTokenOutoutMock),
    );
    userRepositoryMockup.findOne.mockReturnValue(
      Promise.resolve(userCreatedOutputMock),
    );
    tokenRepositoryMockup.find.mockReturnValue(Promise.resolve([]));
    hashPasswordMockup.compareHash.mockReturnValue(Promise.resolve(false));
    userRepositoryMockup.merge.mockReturnValue(
      Promise.resolve(userCreatedOutputMock),
    );
    tokenRepositoryMockup.merge.mockReturnValue(
      Promise.resolve(createTokenOutoutMock),
    );
    userRepositoryMockup.save.mockReturnValue(
      Promise.resolve(userCreatedOutputMock),
    );
    tokenRepositoryMockup.save.mockReturnValue(
      Promise.resolve(createTokenOutoutMock),
    );

    const response = await recoverPasswordService.execute({
      token: dataPasswordUpdate.token,
      password: dataPasswordUpdate.password,
      confirmPassword: dataPasswordUpdate.confirmPassword,
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
    expect(userRepositoryMockup.merge).toHaveBeenCalled();
    expect(userRepositoryMockup.save).toHaveBeenCalled();
    expect(tokenRepositoryMockup.findOne).toHaveBeenCalled();
    expect(tokenRepositoryMockup.find).toHaveBeenCalled();
    expect(tokenRepositoryMockup.merge).toHaveBeenCalled();
    expect(tokenRepositoryMockup.save).toHaveBeenCalled();
    expect(hashPasswordMockup.compareHash).toHaveBeenCalled();
    expect(hashPasswordMockup.generateHash).toHaveBeenCalled();
    expect(mailerMockup.execute).toHaveBeenCalled();
    expect(userRepositoryMockup.findOne).toHaveBeenCalledTimes(1);
    expect(userRepositoryMockup.merge).toHaveBeenCalledTimes(1);
    expect(userRepositoryMockup.save).toHaveBeenCalledTimes(1);
    expect(tokenRepositoryMockup.findOne).toHaveBeenCalledTimes(1);
    expect(tokenRepositoryMockup.find).toHaveBeenCalledTimes(1);
    expect(tokenRepositoryMockup.merge).toHaveBeenCalledTimes(1);
    expect(tokenRepositoryMockup.save).toHaveBeenCalledTimes(1);
    expect(hashPasswordMockup.compareHash).toHaveBeenCalledTimes(1);
    expect(hashPasswordMockup.generateHash).toHaveBeenCalledTimes(1);
    expect(mailerMockup.execute).toHaveBeenCalledTimes(1);
  });

  it('Should not be able update password the when the token repassed for requisition does not exists in database', async () => {
    const dataPasswordUpdate: RedefinePasswordDTO = {
      token: '64282815-b4eb-4a2b-a2f4-0c2689e380a5',
      password: 'qwe123',
      confirmPassword: 'qwe123',
    };

    tokenRepositoryMockup.findOne.mockReturnValue(Promise.resolve());

    expect(
      recoverPasswordService.execute({
        token: dataPasswordUpdate.token,
        password: dataPasswordUpdate.password,
        confirmPassword: dataPasswordUpdate.confirmPassword,
      }),
    ).rejects.toEqual(
      new NotFoundException('This token does not exists in database'),
    );
    expect(userRepositoryMockup.findOne).not.toHaveBeenCalled();
    expect(userRepositoryMockup.merge).not.toHaveBeenCalled();
    expect(userRepositoryMockup.save).not.toHaveBeenCalled();
    expect(tokenRepositoryMockup.findOne).toHaveBeenCalled();
    expect(tokenRepositoryMockup.find).not.toHaveBeenCalled();
    expect(tokenRepositoryMockup.merge).not.toHaveBeenCalled();
    expect(tokenRepositoryMockup.save).not.toHaveBeenCalled();
    expect(hashPasswordMockup.compareHash).not.toHaveBeenCalled();
    expect(hashPasswordMockup.generateHash).not.toHaveBeenCalled();
    expect(mailerMockup.execute).not.toHaveBeenCalled();
    expect(userRepositoryMockup.findOne).toHaveBeenCalledTimes(0);
    expect(userRepositoryMockup.merge).toHaveBeenCalledTimes(0);
    expect(userRepositoryMockup.save).toHaveBeenCalledTimes(0);
    expect(tokenRepositoryMockup.findOne).toHaveBeenCalledTimes(1);
    expect(tokenRepositoryMockup.find).toHaveBeenCalledTimes(0);
    expect(tokenRepositoryMockup.merge).toHaveBeenCalledTimes(0);
    expect(tokenRepositoryMockup.save).toHaveBeenCalledTimes(0);
    expect(hashPasswordMockup.compareHash).toHaveBeenCalledTimes(0);
    expect(hashPasswordMockup.generateHash).toHaveBeenCalledTimes(0);
    expect(mailerMockup.execute).toHaveBeenCalledTimes(0);
  });

  it('Should not be able update password the when the user contained on token repassed does not exists in database', async () => {
    const dataPasswordUpdate: RedefinePasswordDTO = {
      token: '64282815-b4eb-4a2b-a2f4-0c2689e380a5',
      password: 'qwe123',
      confirmPassword: 'qwe123',
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

    tokenRepositoryMockup.findOne.mockReturnValue(
      Promise.resolve(createTokenOutoutMock),
    );
    userRepositoryMockup.findOne.mockReturnValue(Promise.resolve());

    expect(
      recoverPasswordService.execute({
        token: dataPasswordUpdate.token,
        password: dataPasswordUpdate.password,
        confirmPassword: dataPasswordUpdate.confirmPassword,
      }),
    ).rejects.toEqual(
      new NotFoundException(
        'This user of this token does not exists in database',
      ),
    );
    expect(userRepositoryMockup.findOne).not.toHaveBeenCalled();
    expect(userRepositoryMockup.merge).not.toHaveBeenCalled();
    expect(userRepositoryMockup.save).not.toHaveBeenCalled();
    expect(tokenRepositoryMockup.findOne).toHaveBeenCalled();
    expect(tokenRepositoryMockup.find).not.toHaveBeenCalled();
    expect(tokenRepositoryMockup.merge).not.toHaveBeenCalled();
    expect(tokenRepositoryMockup.save).not.toHaveBeenCalled();
    expect(hashPasswordMockup.compareHash).not.toHaveBeenCalled();
    expect(hashPasswordMockup.generateHash).not.toHaveBeenCalled();
    expect(mailerMockup.execute).not.toHaveBeenCalled();
    expect(userRepositoryMockup.findOne).toHaveBeenCalledTimes(0);
    expect(userRepositoryMockup.merge).toHaveBeenCalledTimes(0);
    expect(userRepositoryMockup.save).toHaveBeenCalledTimes(0);
    expect(tokenRepositoryMockup.findOne).toHaveBeenCalledTimes(1);
    expect(tokenRepositoryMockup.find).toHaveBeenCalledTimes(0);
    expect(tokenRepositoryMockup.merge).toHaveBeenCalledTimes(0);
    expect(tokenRepositoryMockup.save).toHaveBeenCalledTimes(0);
    expect(hashPasswordMockup.compareHash).toHaveBeenCalledTimes(0);
    expect(hashPasswordMockup.generateHash).toHaveBeenCalledTimes(0);
    expect(mailerMockup.execute).toHaveBeenCalledTimes(0);
  });

  it("Should not be able update password the when the token repassed for requisition it's not the most current", async () => {
    const userCreatedOutputMock: User = {
      id: '64282815-b4eb-4a2b-a2f4-0c2689e380a4',
      name: 'User Test',
      username: 'usertest',
      email: 'usertest@gmail.com',
      password: '$2a$12$ef9HJafpDSQ13XnxrpuU.Og9O43rbuOnUlFMn6MAU3M2qa0DsQQYi',
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

    const arrayTokensRelationToUser: Array<Token> = [
      {
        id: '64282815-b4eb-4a2b-a2f4-0c2689e380a3',
        token: '64282815-b4eb-4a2b-a2f4-0c2689e380a5',
        used: false,
        user_id: userCreatedOutputMock.id,
        user: userCreatedOutputMock,
        used_in: null,
        expires: new Date('2022/03/03'),
        created_at: new Date('2022/02/26'),
        updated_at: new Date(),
      },
      {
        id: '64282815-b4eb-4a2b-a2f4-0c2689e380a1',
        token: '64282815-b4eb-4a2b-a2f4-0c2689e380a8',
        used: false,
        user_id: userCreatedOutputMock.id,
        user: userCreatedOutputMock,
        used_in: null,
        expires: new Date('2022/03/03'),
        created_at: new Date('2022/02/26'),
        updated_at: new Date(),
      },
    ];

    const dataPasswordUpdate: RedefinePasswordDTO = {
      token: createTokenOutoutMock.token,
      password: 'qwe123',
      confirmPassword: 'qwe123',
    };

    tokenRepositoryMockup.findOne.mockReturnValue(
      Promise.resolve(createTokenOutoutMock),
    );
    userRepositoryMockup.findOne.mockReturnValue(
      Promise.resolve(userCreatedOutputMock),
    );
    tokenRepositoryMockup.find.mockReturnValue(
      Promise.resolve(arrayTokensRelationToUser),
    );

    expect(
      recoverPasswordService.execute({
        token: dataPasswordUpdate.token,
        password: dataPasswordUpdate.password,
        confirmPassword: dataPasswordUpdate.confirmPassword,
      }),
    ).rejects.toEqual(new UnauthorizedException('This token does not active'));
    expect(userRepositoryMockup.findOne).not.toHaveBeenCalled();
    expect(userRepositoryMockup.merge).not.toHaveBeenCalled();
    expect(userRepositoryMockup.save).not.toHaveBeenCalled();
    expect(tokenRepositoryMockup.findOne).toHaveBeenCalled();
    expect(tokenRepositoryMockup.find).not.toHaveBeenCalled();
    expect(tokenRepositoryMockup.merge).not.toHaveBeenCalled();
    expect(tokenRepositoryMockup.save).not.toHaveBeenCalled();
    expect(hashPasswordMockup.compareHash).not.toHaveBeenCalled();
    expect(hashPasswordMockup.generateHash).not.toHaveBeenCalled();
    expect(mailerMockup.execute).not.toHaveBeenCalled();
    expect(userRepositoryMockup.findOne).toHaveBeenCalledTimes(0);
    expect(userRepositoryMockup.merge).toHaveBeenCalledTimes(0);
    expect(userRepositoryMockup.save).toHaveBeenCalledTimes(0);
    expect(tokenRepositoryMockup.findOne).toHaveBeenCalledTimes(1);
    expect(tokenRepositoryMockup.find).toHaveBeenCalledTimes(0);
    expect(tokenRepositoryMockup.merge).toHaveBeenCalledTimes(0);
    expect(tokenRepositoryMockup.save).toHaveBeenCalledTimes(0);
    expect(hashPasswordMockup.compareHash).toHaveBeenCalledTimes(0);
    expect(hashPasswordMockup.generateHash).toHaveBeenCalledTimes(0);
    expect(mailerMockup.execute).toHaveBeenCalledTimes(0);
  });

  it('Should not be able update password the when the token repassed for requisition has expired', async () => {
    const userCreatedOutputMock: User = {
      id: '64282815-b4eb-4a2b-a2f4-0c2689e380a4',
      name: 'User Test',
      username: 'usertest',
      email: 'usertest@gmail.com',
      password: '$2a$12$ef9HJafpDSQ13XnxrpuU.Og9O43rbuOnUlFMn6MAU3M2qa0DsQQYi',
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
      expires: new Date('2022/02/24'),
      created_at: new Date(),
      updated_at: new Date(),
    };

    const dataPasswordUpdate: RedefinePasswordDTO = {
      token: createTokenOutoutMock.token,
      password: 'qwe123',
      confirmPassword: 'qwe123',
    };

    tokenRepositoryMockup.findOne.mockReturnValue(
      Promise.resolve(createTokenOutoutMock),
    );
    userRepositoryMockup.findOne.mockReturnValue(
      Promise.resolve(userCreatedOutputMock),
    );
    tokenRepositoryMockup.find.mockReturnValue(Promise.resolve([]));

    expect(
      recoverPasswordService.execute({
        token: dataPasswordUpdate.token,
        password: dataPasswordUpdate.password,
        confirmPassword: dataPasswordUpdate.confirmPassword,
      }),
    ).rejects.toEqual(new UnauthorizedException('This token has expired'));
    expect(userRepositoryMockup.findOne).not.toHaveBeenCalled();
    expect(userRepositoryMockup.merge).not.toHaveBeenCalled();
    expect(userRepositoryMockup.save).not.toHaveBeenCalled();
    expect(tokenRepositoryMockup.findOne).toHaveBeenCalled();
    expect(tokenRepositoryMockup.find).not.toHaveBeenCalled();
    expect(tokenRepositoryMockup.merge).not.toHaveBeenCalled();
    expect(tokenRepositoryMockup.save).not.toHaveBeenCalled();
    expect(hashPasswordMockup.compareHash).not.toHaveBeenCalled();
    expect(hashPasswordMockup.generateHash).not.toHaveBeenCalled();
    expect(mailerMockup.execute).not.toHaveBeenCalled();
    expect(userRepositoryMockup.findOne).toHaveBeenCalledTimes(0);
    expect(userRepositoryMockup.merge).toHaveBeenCalledTimes(0);
    expect(userRepositoryMockup.save).toHaveBeenCalledTimes(0);
    expect(tokenRepositoryMockup.findOne).toHaveBeenCalledTimes(1);
    expect(tokenRepositoryMockup.find).toHaveBeenCalledTimes(0);
    expect(tokenRepositoryMockup.merge).toHaveBeenCalledTimes(0);
    expect(tokenRepositoryMockup.save).toHaveBeenCalledTimes(0);
    expect(hashPasswordMockup.compareHash).toHaveBeenCalledTimes(0);
    expect(hashPasswordMockup.generateHash).toHaveBeenCalledTimes(0);
    expect(mailerMockup.execute).toHaveBeenCalledTimes(0);
  });

  it('Should not be able update password the when the token repassed was used previously', async () => {
    const userCreatedOutputMock: User = {
      id: '64282815-b4eb-4a2b-a2f4-0c2689e380a4',
      name: 'User Test',
      username: 'usertest',
      email: 'usertest@gmail.com',
      password: '$2a$12$ef9HJafpDSQ13XnxrpuU.Og9O43rbuOnUlFMn6MAU3M2qa0DsQQYi',
      created_at: new Date(),
      updated_at: new Date(),
    };

    const createTokenOutoutMock: Token = {
      id: '64282815-b4eb-4a2b-a2f4-0c2689e380a3',
      token: '64282815-b4eb-4a2b-a2f4-0c2689e380a5',
      used: true,
      user_id: userCreatedOutputMock.id,
      user: userCreatedOutputMock,
      used_in: new Date(),
      expires: new Date('2022/03/03'),
      created_at: new Date(),
      updated_at: new Date(),
    };

    const dataPasswordUpdate: RedefinePasswordDTO = {
      token: createTokenOutoutMock.token,
      password: 'qwe123',
      confirmPassword: 'qwe123',
    };

    tokenRepositoryMockup.findOne.mockReturnValue(
      Promise.resolve(createTokenOutoutMock),
    );
    userRepositoryMockup.findOne.mockReturnValue(
      Promise.resolve(userCreatedOutputMock),
    );
    tokenRepositoryMockup.find.mockReturnValue(Promise.resolve([]));

    expect(
      recoverPasswordService.execute({
        token: dataPasswordUpdate.token,
        password: dataPasswordUpdate.password,
        confirmPassword: dataPasswordUpdate.confirmPassword,
      }),
    ).rejects.toEqual(
      new UnauthorizedException('This token was used previously'),
    );
    expect(userRepositoryMockup.findOne).not.toHaveBeenCalled();
    expect(userRepositoryMockup.merge).not.toHaveBeenCalled();
    expect(userRepositoryMockup.save).not.toHaveBeenCalled();
    expect(tokenRepositoryMockup.findOne).toHaveBeenCalled();
    expect(tokenRepositoryMockup.find).not.toHaveBeenCalled();
    expect(tokenRepositoryMockup.merge).not.toHaveBeenCalled();
    expect(tokenRepositoryMockup.save).not.toHaveBeenCalled();
    expect(hashPasswordMockup.compareHash).not.toHaveBeenCalled();
    expect(hashPasswordMockup.generateHash).not.toHaveBeenCalled();
    expect(mailerMockup.execute).not.toHaveBeenCalled();
    expect(userRepositoryMockup.findOne).toHaveBeenCalledTimes(0);
    expect(userRepositoryMockup.merge).toHaveBeenCalledTimes(0);
    expect(userRepositoryMockup.save).toHaveBeenCalledTimes(0);
    expect(tokenRepositoryMockup.findOne).toHaveBeenCalledTimes(1);
    expect(tokenRepositoryMockup.find).toHaveBeenCalledTimes(0);
    expect(tokenRepositoryMockup.merge).toHaveBeenCalledTimes(0);
    expect(tokenRepositoryMockup.save).toHaveBeenCalledTimes(0);
    expect(hashPasswordMockup.compareHash).toHaveBeenCalledTimes(0);
    expect(hashPasswordMockup.generateHash).toHaveBeenCalledTimes(0);
    expect(mailerMockup.execute).toHaveBeenCalledTimes(0);
  });

  it('Should not be able update password the when the passwords repassed not combine', async () => {
    const userCreatedOutputMock: User = {
      id: '64282815-b4eb-4a2b-a2f4-0c2689e380a4',
      name: 'User Test',
      username: 'usertest',
      email: 'usertest@gmail.com',
      password: '$2a$12$ef9HJafpDSQ13XnxrpuU.Og9O43rbuOnUlFMn6MAU3M2qa0DsQQYi',
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

    const dataPasswordUpdate: RedefinePasswordDTO = {
      token: createTokenOutoutMock.token,
      password: 'qwe123',
      confirmPassword: 'qwe123a',
    };

    tokenRepositoryMockup.findOne.mockReturnValue(
      Promise.resolve(createTokenOutoutMock),
    );
    userRepositoryMockup.findOne.mockReturnValue(
      Promise.resolve(userCreatedOutputMock),
    );
    tokenRepositoryMockup.find.mockReturnValue(Promise.resolve([]));

    expect(
      recoverPasswordService.execute({
        token: dataPasswordUpdate.token,
        password: dataPasswordUpdate.password,
        confirmPassword: dataPasswordUpdate.confirmPassword,
      }),
    ).rejects.toEqual(
      new UnauthorizedException('This passwords repassed does not match'),
    );
    expect(userRepositoryMockup.findOne).not.toHaveBeenCalled();
    expect(userRepositoryMockup.merge).not.toHaveBeenCalled();
    expect(userRepositoryMockup.save).not.toHaveBeenCalled();
    expect(tokenRepositoryMockup.findOne).toHaveBeenCalled();
    expect(tokenRepositoryMockup.find).not.toHaveBeenCalled();
    expect(tokenRepositoryMockup.merge).not.toHaveBeenCalled();
    expect(tokenRepositoryMockup.save).not.toHaveBeenCalled();
    expect(hashPasswordMockup.compareHash).not.toHaveBeenCalled();
    expect(hashPasswordMockup.generateHash).not.toHaveBeenCalled();
    expect(mailerMockup.execute).not.toHaveBeenCalled();
    expect(userRepositoryMockup.findOne).toHaveBeenCalledTimes(0);
    expect(userRepositoryMockup.merge).toHaveBeenCalledTimes(0);
    expect(userRepositoryMockup.save).toHaveBeenCalledTimes(0);
    expect(tokenRepositoryMockup.findOne).toHaveBeenCalledTimes(1);
    expect(tokenRepositoryMockup.find).toHaveBeenCalledTimes(0);
    expect(tokenRepositoryMockup.merge).toHaveBeenCalledTimes(0);
    expect(tokenRepositoryMockup.save).toHaveBeenCalledTimes(0);
    expect(hashPasswordMockup.compareHash).toHaveBeenCalledTimes(0);
    expect(hashPasswordMockup.generateHash).toHaveBeenCalledTimes(0);
    expect(mailerMockup.execute).toHaveBeenCalledTimes(0);
  });

  it('Should not be able update password the when the new password repassed is equal the last password', async () => {
    const userCreatedOutputMock: User = {
      id: '64282815-b4eb-4a2b-a2f4-0c2689e380a4',
      name: 'User Test',
      username: 'usertest',
      email: 'usertest@gmail.com',
      password: '$2a$12$ef9HJafpDSQ13XnxrpuU.Og9O43rbuOnUlFMn6MAU3M2qa0DsQQYi',
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

    const dataPasswordUpdate: RedefinePasswordDTO = {
      token: createTokenOutoutMock.token,
      password: 'qwe123',
      confirmPassword: 'qwe123',
    };

    tokenRepositoryMockup.findOne.mockReturnValue(
      Promise.resolve(createTokenOutoutMock),
    );
    userRepositoryMockup.findOne.mockReturnValue(
      Promise.resolve(userCreatedOutputMock),
    );
    tokenRepositoryMockup.find.mockReturnValue(Promise.resolve([]));
    hashPasswordMockup.compareHash.mockReturnValue(Promise.resolve(true));

    expect(
      recoverPasswordService.execute({
        token: dataPasswordUpdate.token,
        password: dataPasswordUpdate.password,
        confirmPassword: dataPasswordUpdate.confirmPassword,
      }),
    ).rejects.toEqual(
      new UnauthorizedException(
        'This new password is equal the last password, try other',
      ),
    );
    expect(userRepositoryMockup.findOne).not.toHaveBeenCalled();
    expect(userRepositoryMockup.merge).not.toHaveBeenCalled();
    expect(userRepositoryMockup.save).not.toHaveBeenCalled();
    expect(tokenRepositoryMockup.findOne).toHaveBeenCalled();
    expect(tokenRepositoryMockup.find).not.toHaveBeenCalled();
    expect(tokenRepositoryMockup.merge).not.toHaveBeenCalled();
    expect(tokenRepositoryMockup.save).not.toHaveBeenCalled();
    expect(hashPasswordMockup.compareHash).not.toHaveBeenCalled();
    expect(hashPasswordMockup.generateHash).not.toHaveBeenCalled();
    expect(mailerMockup.execute).not.toHaveBeenCalled();
    expect(userRepositoryMockup.findOne).toHaveBeenCalledTimes(0);
    expect(userRepositoryMockup.merge).toHaveBeenCalledTimes(0);
    expect(userRepositoryMockup.save).toHaveBeenCalledTimes(0);
    expect(tokenRepositoryMockup.findOne).toHaveBeenCalledTimes(1);
    expect(tokenRepositoryMockup.find).toHaveBeenCalledTimes(0);
    expect(tokenRepositoryMockup.merge).toHaveBeenCalledTimes(0);
    expect(tokenRepositoryMockup.save).toHaveBeenCalledTimes(0);
    expect(hashPasswordMockup.compareHash).toHaveBeenCalledTimes(0);
    expect(hashPasswordMockup.generateHash).toHaveBeenCalledTimes(0);
    expect(mailerMockup.execute).toHaveBeenCalledTimes(0);
  });
});
