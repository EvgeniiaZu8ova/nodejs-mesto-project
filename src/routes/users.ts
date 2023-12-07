import { celebrate, Joi } from "celebrate";
import { Router } from "express";
import {
  getUsers,
  getUser,
  updateUser,
  updateProfile,
  updateAvatar,
  getCurrentUser,
} from "../controllers/users";

const usersRouter = Router();

usersRouter.get("/", getUsers);

usersRouter.get("/me", getCurrentUser);

usersRouter.get(
  "/:id",
  celebrate({
    params: Joi.object().keys({
      id: Joi.string(),
    }),
  }),
  getUser
);

usersRouter.patch(
  "/me",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(200),
    }),
  }),
  updateProfile(updateUser)
);

usersRouter.patch(
  "/me/avatar",
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string(),
    }),
  }),
  updateAvatar(updateUser)
);

export default usersRouter;
