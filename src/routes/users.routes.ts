import { Router } from 'express';
import { getRepository } from 'typeorm';

import CreateUserService from '../services/CreateUserService';
import User from '../models/User';

const usersRouter = Router();
const createUserService = new CreateUserService();

usersRouter.post('/', async (request, response) => {
  try {
    const { name, email, password } = request.body;

    const user = await createUserService.execute({
      name,
      email,
      password,
    });

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
