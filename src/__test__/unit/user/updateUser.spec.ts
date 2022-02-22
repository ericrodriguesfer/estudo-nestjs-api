import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import UpdateUserService from '../../../modules/user/services/updateUser.service';
import User from '../../../modules/user/infra/typeorm/entities/User';
import BCryptHash from '../../../modules/user/providers/Hash/implementations/BCryptHash';
import {
  userRepositoryMockup,
  hashPasswordMockup,
} from './mocks/mocksUpdateUser';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

describe('Testing the functions of update users', () => {
  let updateUserService: UpdateUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateUserService,
        {
          provide: getRepositoryToken(User),
          useValue: userRepositoryMockup,
        },
        {
          provide: BCryptHash,
          useValue: hashPasswordMockup,
        },
      ],
    }).compile();

    updateUserService = module.get<UpdateUserService>(UpdateUserService);
  });

  afterEach(async () => {
    jest.resetAllMocks();
  });

  it('Should be able defined update user service', async () => {
    expect(updateUserService).toBeDefined();
  });

  it('Should be able update a user with no data changed', async () => {
    const userUpdatedOutputMock: User = {
      id: '64282815-b4eb-4a2b-a2f4-0c2689e380a4',
      name: 'User Test',
      username: 'usertest',
      email: 'usertest@gmail.com',
      password: '$2a$12$ef9HJafpDSQ13XnxrpuU.Og9O43rbuOnUlFMn6MAU3M2qa0DsQQYi',
      created_at: new Date(),
      updated_at: new Date(),
    };

    userRepositoryMockup.findOne.mockReturnValueOnce(
      Promise.resolve(userUpdatedOutputMock),
    );
    userRepositoryMockup.merge.mockReturnValueOnce(
      Promise.resolve(userUpdatedOutputMock),
    );
    userRepositoryMockup.save.mockReturnValueOnce(
      Promise.resolve(userUpdatedOutputMock),
    );

    const response = await updateUserService.execute(
      '64282815-b4eb-4a2b-a2f4-0c2689e380a4',
      {},
    );

    expect(response).toEqual(userUpdatedOutputMock);
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
    expect(userRepositoryMockup.save).toHaveBeenCalled();
    expect(userRepositoryMockup.merge).toHaveBeenCalled();
    expect(hashPasswordMockup.generateHash).not.toHaveBeenCalled();
    expect(userRepositoryMockup.findOne).toHaveBeenCalledTimes(1);
    expect(userRepositoryMockup.save).toHaveBeenCalledTimes(1);
    expect(userRepositoryMockup.merge).toHaveBeenCalledTimes(1);
    expect(hashPasswordMockup.generateHash).toHaveBeenCalledTimes(0);
  });

  it('Should be able update a user with just the modified email and valid', async () => {
    const userUpdateInputMock: Pick<User, 'email'> = {
      email: 'usertest2@gmail.com',
    };

    const userUpdatedOutputMock: User = {
      id: '64282815-b4eb-4a2b-a2f4-0c2689e380a4',
      name: 'User Test',
      username: 'usertest',
      email: 'usertest2@gmail.com',
      password: '$2a$12$ef9HJafpDSQ13XnxrpuU.Og9O43rbuOnUlFMn6MAU3M2qa0DsQQYi',
      created_at: new Date(),
      updated_at: new Date(),
    };

    userRepositoryMockup.findOne.mockReturnValueOnce(
      Promise.resolve(userUpdatedOutputMock),
    );
    userRepositoryMockup.merge.mockReturnValueOnce(
      Promise.resolve(userUpdatedOutputMock),
    );
    userRepositoryMockup.save.mockReturnValueOnce(
      Promise.resolve(userUpdatedOutputMock),
    );

    const response = await updateUserService.execute(
      '64282815-b4eb-4a2b-a2f4-0c2689e380a4',
      { email: userUpdateInputMock.email },
    );

    expect(response).toEqual(userUpdatedOutputMock);
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
    expect(response.email).toBe('usertest2@gmail.com');
    expect(response.password).toBe(
      '$2a$12$ef9HJafpDSQ13XnxrpuU.Og9O43rbuOnUlFMn6MAU3M2qa0DsQQYi',
    );
    expect(userRepositoryMockup.findOne).toHaveBeenCalled();
    expect(userRepositoryMockup.save).toHaveBeenCalled();
    expect(userRepositoryMockup.merge).toHaveBeenCalled();
    expect(hashPasswordMockup.generateHash).not.toHaveBeenCalled();
    expect(userRepositoryMockup.findOne).toHaveBeenCalledTimes(1);
    expect(userRepositoryMockup.save).toHaveBeenCalledTimes(1);
    expect(userRepositoryMockup.merge).toHaveBeenCalledTimes(1);
    expect(hashPasswordMockup.generateHash).toHaveBeenCalledTimes(0);
  });

  it('Should not be able update a user what user not exists', async () => {
    expect(
      updateUserService.execute('64282815-b4eb-4a2b-a2f4-0c2689e380a4', {}),
    ).rejects.toEqual(
      new NotFoundException('This user does not exists in database'),
    );
    expect(userRepositoryMockup.findOne).toHaveBeenCalled();
    expect(userRepositoryMockup.save).not.toHaveBeenCalled();
    expect(userRepositoryMockup.merge).not.toHaveBeenCalled();
    expect(hashPasswordMockup.generateHash).not.toHaveBeenCalled();
    expect(userRepositoryMockup.findOne).toHaveBeenCalledTimes(1);
    expect(userRepositoryMockup.save).toHaveBeenCalledTimes(0);
    expect(userRepositoryMockup.merge).toHaveBeenCalledTimes(0);
    expect(hashPasswordMockup.generateHash).toHaveBeenCalledTimes(0);
  });

  it('Should not be able update a user with just the modified invalid email', async () => {
    const userUpdateInputMock: Pick<User, 'email'> = {
      email: 'usertest2@gmail.com',
    };

    const userUpdatedOutputMock: User = {
      id: '64282815-b4eb-4a2b-a2f4-0c2689e380a4',
      name: 'User Test',
      username: 'usertest',
      email: 'usertest@gmail.com',
      password: '$2a$12$ef9HJafpDSQ13XnxrpuU.Og9O43rbuOnUlFMn6MAU3M2qa0DsQQYi',
      created_at: new Date(),
      updated_at: new Date(),
    };

    userRepositoryMockup.findOne.mockReturnValueOnce(
      Promise.resolve(userUpdatedOutputMock),
    );
    userRepositoryMockup.findOne.mockReturnValueOnce(
      Promise.resolve(userUpdatedOutputMock),
    );
    userRepositoryMockup.merge.mockReturnValueOnce(Promise.resolve());
    userRepositoryMockup.save.mockReturnValueOnce(Promise.resolve());

    expect(
      updateUserService.execute('64282815-b4eb-4a2b-a2f4-0c2689e380a4', {
        email: userUpdateInputMock.email,
      }),
    ).rejects.toEqual(
      new UnauthorizedException('This email is in usage for other user'),
    );
    expect(userRepositoryMockup.findOne).toHaveBeenCalled();
    expect(userRepositoryMockup.save).not.toHaveBeenCalled();
    expect(userRepositoryMockup.merge).not.toHaveBeenCalled();
    expect(hashPasswordMockup.generateHash).not.toHaveBeenCalled();
    expect(userRepositoryMockup.findOne).toHaveBeenCalledTimes(1);
    expect(userRepositoryMockup.save).toHaveBeenCalledTimes(0);
    expect(userRepositoryMockup.merge).toHaveBeenCalledTimes(0);
    expect(hashPasswordMockup.generateHash).toHaveBeenCalledTimes(0);
  });

  it('Should not be able update a user with just the modified invalid username', async () => {
    const userUpdateInputMock: Pick<User, 'username'> = {
      username: 'usertest2',
    };

    const userUpdatedOutputMock: User = {
      id: '64282815-b4eb-4a2b-a2f4-0c2689e380a4',
      name: 'User Test',
      username: 'usertest',
      email: 'usertest@gmail.com',
      password: '$2a$12$ef9HJafpDSQ13XnxrpuU.Og9O43rbuOnUlFMn6MAU3M2qa0DsQQYi',
      created_at: new Date(),
      updated_at: new Date(),
    };

    userRepositoryMockup.findOne.mockReturnValueOnce(
      Promise.resolve(userUpdatedOutputMock),
    );
    userRepositoryMockup.findOne.mockReturnValueOnce(
      Promise.resolve(userUpdatedOutputMock),
    );
    userRepositoryMockup.findOne.mockReturnValueOnce(
      Promise.resolve(userUpdatedOutputMock),
    );
    userRepositoryMockup.merge.mockReturnValueOnce(Promise.resolve());
    userRepositoryMockup.save.mockReturnValueOnce(Promise.resolve());

    expect(
      updateUserService.execute('64282815-b4eb-4a2b-a2f4-0c2689e380a4', {
        username: userUpdateInputMock.username,
      }),
    ).rejects.toEqual(
      new UnauthorizedException('This username is in usage for other user'),
    );
    expect(userRepositoryMockup.findOne).toHaveBeenCalled();
    expect(userRepositoryMockup.save).not.toHaveBeenCalled();
    expect(userRepositoryMockup.merge).not.toHaveBeenCalled();
    expect(hashPasswordMockup.generateHash).not.toHaveBeenCalled();
    expect(userRepositoryMockup.findOne).toHaveBeenCalledTimes(1);
    expect(userRepositoryMockup.save).toHaveBeenCalledTimes(0);
    expect(userRepositoryMockup.merge).toHaveBeenCalledTimes(0);
    expect(hashPasswordMockup.generateHash).toHaveBeenCalledTimes(0);
  });

  it('Should be able update a user with all fields updated and valids', async () => {
    const userUpdateInputMock: Omit<User, 'id' | 'created_at' | 'updated_at'> =
      {
        name: 'User Test 2',
        username: 'usertest2',
        email: 'usertest2@gmail.com',
        password: '123qwe',
      };

    const userUpdatedOutputMock: User = {
      id: '64282815-b4eb-4a2b-a2f4-0c2689e380a4',
      name: 'User Test 2',
      username: 'usertest2',
      email: 'usertest2@gmail.com',
      password: '$2a$12$ef9HJafpDSQ13XnxrpuU.Og9O43rbuOnUlFMn6MAU3M2qa0DsQQYi',
      created_at: new Date(),
      updated_at: new Date(),
    };

    userRepositoryMockup.findOne.mockReturnValueOnce(
      Promise.resolve(userUpdatedOutputMock),
    );
    userRepositoryMockup.findOne.mockReturnValueOnce(Promise.resolve());
    userRepositoryMockup.findOne.mockReturnValueOnce(Promise.resolve());
    userRepositoryMockup.merge.mockReturnValueOnce(
      Promise.resolve(userUpdatedOutputMock),
    );
    userRepositoryMockup.save.mockReturnValueOnce(
      Promise.resolve(userUpdatedOutputMock),
    );

    const response = await updateUserService.execute(
      '64282815-b4eb-4a2b-a2f4-0c2689e380a4',
      {
        name: userUpdateInputMock.name,
        username: userUpdateInputMock.username,
        email: userUpdateInputMock.email,
        password: userUpdateInputMock.password,
      },
    );

    expect(response).toEqual(userUpdatedOutputMock);
    expect(response).toHaveProperty('id');
    expect(response).toHaveProperty('name');
    expect(response).toHaveProperty('username');
    expect(response).toHaveProperty('email');
    expect(response).toHaveProperty('password');
    expect(response).toHaveProperty('created_at');
    expect(response).toHaveProperty('updated_at');
    expect(response.id).toBe('64282815-b4eb-4a2b-a2f4-0c2689e380a4');
    expect(response.name).toBe('User Test 2');
    expect(response.username).toBe('usertest2');
    expect(response.email).toBe('usertest2@gmail.com');
    expect(response.password).toBe(
      '$2a$12$ef9HJafpDSQ13XnxrpuU.Og9O43rbuOnUlFMn6MAU3M2qa0DsQQYi',
    );
    expect(userRepositoryMockup.findOne).toHaveBeenCalled();
    expect(userRepositoryMockup.save).toHaveBeenCalled();
    expect(userRepositoryMockup.merge).toHaveBeenCalled();
    expect(hashPasswordMockup.generateHash).toHaveBeenCalled();
    expect(userRepositoryMockup.findOne).toHaveBeenCalledTimes(1);
    expect(userRepositoryMockup.save).toHaveBeenCalledTimes(1);
    expect(userRepositoryMockup.merge).toHaveBeenCalledTimes(1);
    expect(hashPasswordMockup.generateHash).toHaveBeenCalledTimes(1);
  });

  it('Should be able update a user with just the modified password', async () => {
    const userUpdateInputMock: Pick<User, 'password'> = {
      password: '123qwe',
    };

    const userUpdatedOutputMock: User = {
      id: '64282815-b4eb-4a2b-a2f4-0c2689e380a4',
      name: 'User Test',
      username: 'usertest',
      email: 'usertest@gmail.com',
      password: '$2a$12$ef9HJafpDSQ13XnxrpuU.Og9O43rbuOnUlFMn6MAU3M2qa0DsQQYi',
      created_at: new Date(),
      updated_at: new Date(),
    };

    userRepositoryMockup.findOne.mockReturnValueOnce(
      Promise.resolve(userUpdatedOutputMock),
    );
    userRepositoryMockup.merge.mockReturnValueOnce(
      Promise.resolve(userUpdatedOutputMock),
    );
    userRepositoryMockup.save.mockReturnValueOnce(
      Promise.resolve(userUpdatedOutputMock),
    );

    const response = await updateUserService.execute(
      '64282815-b4eb-4a2b-a2f4-0c2689e380a4',
      {
        password: userUpdateInputMock.password,
      },
    );

    expect(response).toEqual(userUpdatedOutputMock);
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
    expect(userRepositoryMockup.save).toHaveBeenCalled();
    expect(userRepositoryMockup.merge).toHaveBeenCalled();
    expect(hashPasswordMockup.generateHash).toHaveBeenCalled();
    expect(userRepositoryMockup.findOne).toHaveBeenCalledTimes(1);
    expect(userRepositoryMockup.save).toHaveBeenCalledTimes(1);
    expect(userRepositoryMockup.merge).toHaveBeenCalledTimes(1);
    expect(hashPasswordMockup.generateHash).toHaveBeenCalledTimes(1);
  });
});
