import { Router } from 'express';

import multer from 'multer';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import uploadsConfig from '@config/uploads';
import UserAvatarController from '../controllers/UserAvatarController';
import UsersController from '../controllers/UsersController';

const usersRouter = Router();
const userAvatarController = new UserAvatarController();
const usersController = new UsersController();

const upload = multer(uploadsConfig);

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  userAvatarController.update,
);

usersRouter.post('/', usersController.create);

export default usersRouter;
