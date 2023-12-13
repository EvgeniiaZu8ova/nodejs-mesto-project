import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import NotFoundError from '../errors/not-found-err';
import ForbiddenError from '../errors/forbidden-err';
import BadReqError from '../errors/bad-req-err';
import Card, { ICard } from '../models/card';

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

export const createCard = (req: Request, res: Response, next: NextFunction) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      let error = err;

      if (err instanceof mongoose.Error.ValidationError) {
        error = new BadReqError('Неверный формат отправки данных');
      }

      next(error);
    });
};

export const deleteCard = (req: Request, res: Response, next: NextFunction) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .orFail()
    .then((data: ICard) => {
      if (String(data?.owner) === req.user._id) {
        Card.deleteOne({ _id: cardId })
          .then(() => res.send({ message: 'Карточка была удалена' }))
          .catch(next);
      } else {
        throw new ForbiddenError('Нельзя удалить чужую карточку');
      }
    })
    .catch((err) => {
      let error = err;

      if (err instanceof mongoose.Error.CastError) {
        error = new BadReqError('В запросе указан невалидный ID карточки');
      }

      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        error = new NotFoundError('Карточка по указанному _id не найдена');
      }

      next(error);
    });
};

export const putLikeOnCard = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      let error = err;

      if (err instanceof mongoose.Error.CastError) {
        error = new BadReqError('В запросе указан невалидный ID карточки');
      }

      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        error = new NotFoundError('Карточка по указанному _id не найдена');
      }

      next(error);
    });
};

export const removeLikeFromCard = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      let error = err;

      if (err instanceof mongoose.Error.CastError) {
        error = new BadReqError('В запросе указан невалидный ID карточки');
      }

      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        error = new NotFoundError('Карточка по указанному _id не найдена');
      }

      next(error);
    });
};
