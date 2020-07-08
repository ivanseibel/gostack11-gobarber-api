import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

describe('AuthenticateUserService', () => {
  it('should be able get an access token', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
    const authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

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
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    let error;

    try {
      await authenticateUser.execute({
        email: 'johndoe@email.com',
        password: '123456',
      });
    } catch (err) {
      error = err;
    }

    expect(error).toBeInstanceOf(AppError);
  });

  it('should not be able get an access token with wrong password', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
    const authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    });

    let error;

    try {
      await authenticateUser.execute({
        email: 'johndoe@email.com',
        password: 'wrong-password',
      });
    } catch (err) {
      error = err;
    }

    expect(error).toBeInstanceOf(AppError);
  });
});
