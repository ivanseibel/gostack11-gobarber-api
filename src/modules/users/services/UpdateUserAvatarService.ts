import path from 'path';
import fs from 'fs';
import User from '@modules/users/infra/typeorm/entities/User';
import uploadConfig from '@config/uploads';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';

interface Request {
  user_id: string;
  avatarFileName: string;
}

class UpdateUserAvatarService {
  constructor(private usersRepository: IUsersRepository) {}

  public async execute({ user_id, avatarFileName }: Request): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('Only authenticated users can change avatar', 401);
    }

    const { avatarDir } = uploadConfig;

    if (user.avatar) {
      const oldAvatar = path.join(avatarDir, user.avatar);
      const oldAvatarExists = await fs.promises.stat(oldAvatar);
      if (oldAvatarExists) {
        await fs.promises.unlink(oldAvatar);
      }
    }

    user.avatar = avatarFileName;

    this.usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
