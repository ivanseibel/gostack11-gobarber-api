import FakeUserRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import AppError from '@shared/errors/AppError';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let usersRepository: FakeUserRepository;
let storageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatarService', () => {
  beforeEach(() => {
    usersRepository = new FakeUserRepository();
    storageProvider = new FakeStorageProvider();

    updateUserAvatar = new UpdateUserAvatarService(
      usersRepository,
      storageProvider,
    );
  });

  it('should be able to upload a new avatar', async () => {
    const newUser = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    });

    const userAvatar = await updateUserAvatar.execute({
      user_id: newUser.id,
      avatarFileName: 'avatar.jpg',
    });

    expect(userAvatar.avatar).toBe('avatar.jpg');
  });

  it('should not be able to upload a new avatar if cannot find user by id', async () => {
    await expect(
      updateUserAvatar.execute({
        user_id: 'without-id',
        avatarFileName: 'avatar.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to delete old avatar when user upload a new one', async () => {
    const newUser = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    });

    const deleteFile = jest.spyOn(storageProvider, 'deleteFile');

    await updateUserAvatar.execute({
      user_id: newUser.id,
      avatarFileName: 'avatar.jpg',
    });

    const userAvatar = await updateUserAvatar.execute({
      user_id: newUser.id,
      avatarFileName: 'avatar1.jpg',
    });

    expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
    expect(userAvatar.avatar).toBe('avatar1.jpg');
  });
});
