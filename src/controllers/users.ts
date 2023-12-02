import { Request, Response } from 'express';
import User from '../models/user';

export const getUsers = (req: Request, res: Response) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

export const getUser = (req: Request, res: Response) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
      }

      return res.send({ data: user });
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.errors.name.name === 'ValidatorError') {
        return res.status(400).send({ message: 'Неверный формат отправки данных' });
      }

      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};

export const updateProfile = (req: Request, res: Response) => {
  User.findByIdAndUpdate(
  // @ts-ignore
    req.user._id,
    { name: req.body.name, about: req.body.about },
    { new: true },
  )
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
      }

      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.errors.name.name === 'ValidatorError') {
        return res.status(400).send({ message: 'Неверный формат отправки данных' });
      }

      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};

export const updateAvatar = (req: Request, res: Response) => {
  // @ts-ignore
  User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar }, { new: true })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
      }

      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.errors.name.name === 'ValidatorError') {
        return res.status(400).send({ message: 'Неверный формат отправки данных' });
      }

      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};
