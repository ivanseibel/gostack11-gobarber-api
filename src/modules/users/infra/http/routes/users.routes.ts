import { Router } from 'express';

import multer from 'multer';
import CreateUserService from '@modules/users/services/CreateUserService';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import uploadsConfig from '@config/uploads';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import { container } from 'tsyringe';

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
    const updateUserAvatar = container.resolve(UpdateUserAvatarService);

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

  const createUser = container.resolve(CreateUserService);
  const user = await createUser.execute({
    name,
    email,
    password,
  });

  delete user.password;

  return response.json(user);
});

export default usersRouter;
