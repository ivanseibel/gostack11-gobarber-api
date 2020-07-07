import { Router } from 'express';

import multer from 'multer';
import CreateUserService from '@modules/users/services/CreateUserService';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import uploadsConfig from '@config/uploads';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import UsersRepository from '../../typeorm/repositories/UsersRepository';

const usersRouter = Router();

const upload = multer(uploadsConfig);

// usersRouter.get('/', async (request, response) => {
//   const usersRepository = getRepository(User);
//   const users = await usersRepository.find();
//   return response.json(users);
// });

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (request, response) => {
    const updateUserAvatar = new UpdateUserAvatarService(new UsersRepository());

    const user = await updateUserAvatar.execute({
      avatarFileName: request.file.filename,
      user_id: request.user.id,
    });

    delete user.password;

    return response.json(user);
  },
);

usersRouter.post('/', async (request, response) => {
  const { name, email, password } = request.body;

  const createUser = new CreateUserService(new UsersRepository());
  const user = await createUser.execute({
    name,
    email,
    password,
  });

  delete user.password;

  return response.json(user);
});

export default usersRouter;
