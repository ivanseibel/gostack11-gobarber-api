import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let listProviders: ListProvidersService;
let fakeCacheProvider: FakeCacheProvider;

describe('CreateUserService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();

    listProviders = new ListProvidersService(
      fakeUsersRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to list providers', async () => {
    const user1 = await fakeUsersRepository.create({
      name: 'John Doe 1',
      email: 'johndoe1@email.com',
      password: '123456',
    });

    const user2 = await fakeUsersRepository.create({
      name: 'John Doe 2',
      email: 'johndoe2@email.com',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      name: 'John Doe 3',
      email: 'johndoe3@email.com',
      password: '123456',
    });

    const providers = await listProviders.execute({ except_user_id: user.id });

    expect(providers).toEqual([user1, user2]);
  });

  it('should be able to list providers using cache', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe 1',
      email: 'johndoe1@email.com',
      password: '123456',
    });

    const providers = await listProviders.execute({
      except_user_id: 'non-existing-user-id',
    });

    providers[0].name = 'cached';

    await fakeCacheProvider.invalidatePrefix('providers-list');

    await fakeCacheProvider.save(
      'providers-list:non-existing-user-id',
      providers,
    );

    const cachedProviders = await listProviders.execute({
      except_user_id: 'non-existing-user-id',
    });

    expect(cachedProviders[0].name).toBe('cached');
  });
});
