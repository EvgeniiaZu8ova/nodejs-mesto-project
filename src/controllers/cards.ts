import { NotFoundError } from "./../errors/not-found-err";
import { ForbiddenError } from "./../errors/forbidden-err";
import { BadReqError } from "./../errors/bad-req-err";
import { NextFunction, Request, Response } from "express";
import http2 from "http2";
import mongoose, { ObjectId } from "mongoose";
import Card, { ICard } from "../models/card";

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

export const createCard = (req: Request, res: Response, next: NextFunction) => {
  const { name, link } = req.body;

  // @ts-ignore
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      let error = err;

      if (err instanceof mongoose.Error.ValidationError) {
        error = new BadReqError("Неверный формат отправки данных");
      }

      next(error);
    });
};

export const deleteCard = (req: Request, res: Response, next: NextFunction) => {
  const cardId = req.params.cardId;

  Card.findById(cardId)
    .orFail()
    .then((data: ICard) => {
      // @ts-ignore
      if (String(data?.owner) === req.user._id) {
        Card.deleteOne({ _id: cardId })
          .orFail()
          .then(() => res.send({ message: "Карточка была удалена" }));
      } else {
        throw new ForbiddenError("Нельзя удалить чужую карточку");
      }
    })
    .catch((err) => {
      let error = err;

      if (err instanceof mongoose.Error.CastError) {
        error = new BadReqError("В запросе указан невалидный ID карточки");
      }

      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        error = new NotFoundError("Карточка по указанному _id не найдена");
      }

      next(error);
    });
};

export const putLikeOnCard = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    // @ts-ignore
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      let error = err;

      if (err instanceof mongoose.Error.CastError) {
        error = new BadReqError("В запросе указан невалидный ID карточки");
      }

      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        error = new NotFoundError("Карточка по указанному _id не найдена");
      }

      next(error);
    });
};

export const removeLikeFromCard = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    // @ts-ignore
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      let error = err;

      if (err instanceof mongoose.Error.CastError) {
        error = new BadReqError("В запросе указан невалидный ID карточки");
      }

      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        error = new NotFoundError("Карточка по указанному _id не найдена");
      }

      next(error);
    });
};
