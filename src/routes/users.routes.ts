import { Router } from 'express';
import { getRepository } from 'typeorm';

import multer from 'multer';
import CreateUserService from '../services/CreateUserService';
import User from '../models/User';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import uploadsConfig from '../config/uploads';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';

const usersRouter = Router();

const createUserService = new CreateUserService();

const upload = multer(uploadsConfig);

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (request, response) => {
    const updateUserAvatarService = new UpdateUserAvatarService();

    const user = await updateUserAvatarService.execute({
      avatarFileName: request.file.filename,
      user_id: request.user.id,
    });

    delete user.password;

    return response.json(user);
  },
);

usersRouter.post('/', async (request, response) => {
  const { name, email, password } = request.body;

  const user = await createUserService.execute({
    name,
    email,
    password,
  });

  delete user.password;

  return response.json(user);
});

usersRouter.get('/', async (request, response) => {
  const usersRepository = getRepository(User);
  const users = await usersRepository.find();
  return response.json(users);
});

export default usersRouter;
