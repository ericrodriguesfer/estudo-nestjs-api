import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import User from '../../../modules/user/infra/typeorm/entities/User';
import GetMeDataService from '../../../modules/user/services/getMeData.service';
import { userRepositoryMockup } from './mocks/mocksGetMeData';

describe('Testing the functions of get me data of users', () => {
  let getMeDataService: GetMeDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetMeDataService,
        {
          provide: getRepositoryToken(User),
          useValue: userRepositoryMockup,
        },
      ],
    }).compile();

    getMeDataService = module.get<GetMeDataService>(GetMeDataService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('Should be able defined get me data service', async () => {
    expect(getMeDataService).toBeDefined();
  });

  it('Should be able get all data of user when he exists', async () => {
    const emailUser = 'usertest@gmail.com';
    const userDataOutputMock: User = {
      id: '64282815-b4eb-4a2b-a2f4-0c2689e380a4',
      name: 'User Test',
      username: 'usertest',
      email: 'usertest@gmail.com',
      password: '$2a$12$ef9HJafpDSQ13XnxrpuU.Og9O43rbuOnUlFMn6MAU3M2qa0DsQQYi',
      phone: '+5585955555555',
      created_at: new Date(),
      updated_at: new Date(),
    };

    userRepositoryMockup.findOne.mockReturnValue(
      Promise.resolve(userDataOutputMock),
    );

    const response = await getMeDataService.execute({ email: emailUser });

    expect(response).toEqual(userDataOutputMock);
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
    expect(userRepositoryMockup.findOne).toHaveBeenCalledTimes(1);
  });

  it('Should not be able get all data of user because user not exists', async () => {
    const emailUser = 'usertest@gmail.com';

    userRepositoryMockup.findOne.mockReturnValueOnce(Promise.resolve());

    expect(getMeDataService.execute({ email: emailUser })).rejects.toEqual(
      new NotFoundException('This user not found in our database'),
    );
    expect(userRepositoryMockup.findOne).toHaveBeenCalled();
    expect(userRepositoryMockup.findOne).toHaveBeenCalledTimes(1);
  });
});
