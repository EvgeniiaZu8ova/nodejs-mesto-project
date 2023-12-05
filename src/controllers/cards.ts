import { Request, Response } from "express";
import http2 from "http2";
import mongoose from "mongoose";
import Card from "../models/card";

export const getCards = (req: Request, res: Response) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) =>
      res
        .status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: err.message })
    );
};

export const createCard = (req: Request, res: Response) => {
  const { name, link } = req.body;

  // @ts-ignore
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
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

export const deleteCard = (req: Request, res: Response) => {
  Card.findByIdAndDelete(req.params.cardId)
    .orFail()
    .then(() => res.send({ message: "Карточка была удалена" }))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res
          .status(http2.constants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: "В запросе указан невалидный ID карточки" });
      }

      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res
          .status(http2.constants.HTTP_STATUS_NOT_FOUND)
          .send({ message: "Карточка по указанному _id не найдена" });
      }

      return res
        .status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: "Произошла ошибка" });
    });
};

export const putLikeOnCard = (req: Request, res: Response) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    // @ts-ignore
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res
          .status(http2.constants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: "В запросе указан невалидный ID карточки" });
      }

      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res
          .status(http2.constants.HTTP_STATUS_NOT_FOUND)
          .send({ message: "Карточка по указанному _id не найдена" });
      }

      return res
        .status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: "Произошла ошибка" });
    });
};

export const removeLikeFromCard = (req: Request, res: Response) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    // @ts-ignore
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res
          .status(http2.constants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: "В запросе указан невалидный ID карточки" });
      }

      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res
          .status(http2.constants.HTTP_STATUS_NOT_FOUND)
          .send({ message: "Карточка по указанному _id не найдена" });
      }

      return res
        .status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: "Произошла ошибка" });
    });
};
