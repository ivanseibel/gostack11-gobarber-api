import AppError from '@shared/errors/AppError';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let authenticateUser: AuthenticateUserService;
let fakeCacheProvider: FakeCacheProvider;

describe('AuthenticateUserService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();

    createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );

    authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able get an access token', async () => {
    const user = await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    });

    const result = await authenticateUser.execute({
      email: 'johndoe@email.com',
      password: '123456',
    });

    expect(result).toHaveProperty('token');
    expect(result.user).toEqual(user);
  });

  it('should not be able get an access token with nonexistent user', async () => {
    await expect(
      authenticateUser.execute({
        email: 'johndoe@email.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able get an access token with wrong password', async () => {
    await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    });

    await expect(
      authenticateUser.execute({
        email: 'johndoe@email.com',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
