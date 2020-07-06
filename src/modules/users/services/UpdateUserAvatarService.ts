import path from 'path';
import fs from 'fs';
import { getRepository } from 'typeorm';
import User from '@modules/users/infra/typeorm/entities/User';
import uploadConfig from '@config/uploads';
import AppError from '@shared/errors/AppError';

interface Request {
  user_id: string;
  avatarFileName: string;
}

class UpdateUserAvatarService {
  public async execute({ user_id, avatarFileName }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne({ where: { id: user_id } });

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

    usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
