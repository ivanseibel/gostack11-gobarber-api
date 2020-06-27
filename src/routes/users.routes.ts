import { Router } from 'express';
import { getRepository } from 'typeorm';

import multer from 'multer';
import CreateUserService from '../services/CreateUserService';
import User from '../models/User';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import uploadsConfig from '../config/uploads';

const usersRouter = Router();

const createUserService = new CreateUserService();

const upload = multer(uploadsConfig);

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (request, response) => {
    return response.json(request.file);
  },
);

usersRouter.post('/', async (request, response) => {
  try {
    const { name, email, password } = request.body;

    const user = await createUserService.execute({
      name,
      email,
      password,
    });

    delete user.password;

    return response.json(user);
  } catch (error) {
    return response.status(400).json({ message: error.message });
  }
});

usersRouter.get('/', async (request, response) => {
  const usersRepository = getRepository(User);
  const users = await usersRepository.find();
  return response.json(users);
});

export default usersRouter;
