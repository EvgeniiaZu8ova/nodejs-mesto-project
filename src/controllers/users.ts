import { Request, Response } from 'express';
import http2 from 'http2';
import User from '../models/user';

export const getUsers = (req: Request, res: Response) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res
      .status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: err.message }));
};

export const getUser = (req: Request, res: Response) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        return res
          .status(http2.constants.HTTP_STATUS_NOT_FOUND)
          .send({ message: 'Пользователь по указанному _id не найден' });
      }

      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(http2.constants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'В запросе указан невалидный ID пользователя' });
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
      if (err.name === 'ValidationError') {
        return res
          .status(http2.constants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Неверный формат отправки данных' });
      }

      return res
        .status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: 'Произошла ошибка' });
    });
};

export const updateProfile = (req: Request, res: Response) => {
  User.findByIdAndUpdate(
  // @ts-ignore
    req.user._id,
    { name: req.body.name, about: req.body.about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        return res
          .status(http2.constants.HTTP_STATUS_NOT_FOUND)
          .send({ message: 'Пользователь по указанному _id не найден' });
      }

      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(http2.constants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Неверный формат отправки данных' });
      }

      return res
        .status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: 'Произошла ошибка' });
    });
};

export const updateAvatar = (req: Request, res: Response) => {
  User.findByIdAndUpdate(
  // @ts-ignore
    req.user._id,
    { avatar: req.body.avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        return res
          .status(http2.constants.HTTP_STATUS_NOT_FOUND)
          .send({ message: 'Пользователь по указанному _id не найден' });
      }

      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(http2.constants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Неверный формат отправки данных' });
      }

      return res
        .status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: 'Произошла ошибка' });
    });
};
