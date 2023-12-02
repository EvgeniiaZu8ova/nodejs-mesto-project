import { Router } from 'express';
import {
  getUsers, getUser, createUser, updateProfile, updateAvatar,
} from '../controllers/users';

const usersRouter = Router();

usersRouter.get('/', getUsers);
usersRouter.get('/:id', getUser);
usersRouter.post('/', createUser);
usersRouter.patch('/me', updateProfile);
usersRouter.patch('/me/avatar', updateAvatar);

export default usersRouter;
