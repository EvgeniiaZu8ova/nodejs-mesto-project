import { Request, Response } from "express";
import http2 from "http2";
import mongoose from "mongoose";
import User from "../models/user";

export const getUsers = (req: Request, res: Response) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) =>
      res
        .status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: err.message })
    );
};

export const getUser = (req: Request, res: Response) => {
  User.findById(req.params.id)
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res
          .status(http2.constants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: "В запросе указан невалидный ID пользователя" });
      }

      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res
          .status(http2.constants.HTTP_STATUS_NOT_FOUND)
          .send({ message: "Пользователь по указанному _id не найден" });
      }

      return res
        .status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: err.message });
    });
};

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res
          .status(http2.constants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: "Неверный формат отправки данных" });
      }

      return res
        .status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: "Произошла ошибка" });
    });
};

export function updateUser(req: Request, res: Response) {
  User.findByIdAndUpdate(
    // @ts-ignore
    req.user._id,
    { name: req.body.name, about: req.body.about, avatar: req.body.avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res
          .status(http2.constants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: "Неверный формат отправки данных" });
      }

      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res
          .status(http2.constants.HTTP_STATUS_NOT_FOUND)
          .send({ message: "Пользователь по указанному _id не найден" });
      }

      return res
        .status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: "Произошла ошибка" });
    });
}

export const updateProfile = function (fn: unknown) {
  return function (req: Request, res: Response) {
    // @ts-ignore
    return fn(
      {
        ...req,
        body: {
          name: req.body.name,
          about: req.body.about,
        },
      },
      res
    );
  };
};

export const updateAvatar = function (fn: unknown) {
  return function (req: Request, res: Response) {
    // @ts-ignore
    return fn(
      {
        ...req,
        body: {
          avatar: req.body.avatar,
        },
      },
      res
    );
  };
};
