import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import BadReqError from '../errors/bad-req-err';
import NotFoundError from '../errors/not-found-err';
import ConflictError from '../errors/conflict-err';
import User from '../models/user';

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

const getUserById = (id: string, res: Response, next: NextFunction) => {
  User.findById(id)
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      let error = err;

      if (err instanceof mongoose.Error.CastError) {
        error = new BadReqError(
          `В запросе указан невалидный ID пользователя: ${id}`,
        );
      }

      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        error = new NotFoundError('Пользователь по указанному _id не найден');
      }

      next(error);
    });
};

// eslint-disable-next-line max-len
export const getUser = (req: Request, res: Response, next: NextFunction) => getUserById(req.params.id, res, next);

export const getCurrentUser = (
  req: Request,
  res: Response,
  next: NextFunction,
) => getUserById(req.user._id, res, next);

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then(() => res.send({ message: 'Пользователь был создан' }))
    .catch((err) => {
      let error = err;

      if (err instanceof mongoose.Error.ValidationError) {
        error = new BadReqError('Неверный формат отправки данных');
      }

      if (err.code === 11000) {
        error = new ConflictError('Такой пользователь уже существует');
      }

      next(error);
    });
};

export const updateProfile = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, about: req.body.about },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      let error = err;

      if (err instanceof mongoose.Error.ValidationError) {
        error = new BadReqError('Неверный формат отправки данных');
      }

      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        error = new NotFoundError('Пользователь по указанному _id не найден');
      }

      next(error);
    });
};

export const updateAvatar = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      let error = err;

      if (err instanceof mongoose.Error.ValidationError) {
        error = new BadReqError('Неверный формат отправки данных');
      }

      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        error = new NotFoundError('Пользователь по указанному _id не найден');
      }

      next(error);
    });
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', {
        expiresIn: '7d',
      });

      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        })
        .end();
    })
    .catch(next);
};
