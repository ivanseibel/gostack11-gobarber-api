import AppError from '@shared/errors/AppError';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/FakeUsersRepository';
import CreateUserService from './CreateUserService';

describe('CreateUserService', () => {
  it('should be able to create new user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const user = await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create new user with existing email', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
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
      await createUser.execute({
        name: 'John Doe',
        email: 'johndoe@email.com',
        password: '123456',
      });
    } catch (err) {
      error = err;
    }

    expect(error).toBeInstanceOf(AppError);
  });
});
