import { Router } from "express";
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateProfile,
  updateAvatar,
} from "../controllers/users";

const usersRouter = Router();

usersRouter.get("/", getUsers);
usersRouter.get("/:id", getUser);
usersRouter.post("/", createUser);
usersRouter.patch("/me", updateProfile(updateUser));
usersRouter.patch("/me/avatar", updateAvatar(updateUser));

export default usersRouter;
