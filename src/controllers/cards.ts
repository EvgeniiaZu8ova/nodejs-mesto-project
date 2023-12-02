import { Request, Response } from 'express';
import Card from '../models/card';

export const getCards = (req: Request, res: Response) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

export const createCard = (req: Request, res: Response) => {
  const { name, link } = req.body;

  // @ts-ignore
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.errors.name.name === 'ValidatorError') {
        return res.status(400).send({ message: 'Неверный формат отправки данных' });
      }

      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};

export const deleteCard = (req: Request, res: Response) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Карточка по указанному _id не найдена' });
      }

      return res.status(204).send({ message: 'Карточка была удалена' });
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

export const putLikeOnCard = (req: Request, res: Response) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    // @ts-ignore
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).then((card) => {
    if (!card) {
      return res.status(404).send({ message: 'Карточка по указанному _id не найдена' });
    }

    return res.send({ data: card });
  })
    .catch((err) => {
      if (err.errors.name.name === 'ValidatorError') {
        return res.status(400).send({ message: 'Неверный формат отправки данных' });
      }

      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};

export const removeLikeFromCard = (req: Request, res: Response) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    // @ts-ignore
    { $pull: { likes: req.user._id } },
    { new: true },
  ).then((card) => {
    if (!card) {
      return res.status(404).send({ message: 'Карточка по указанному _id не найдена' });
    }

    return res.send({ data: card });
  })
    .catch((err) => {
      if (err.errors.name.name === 'ValidatorError') {
        return res.status(400).send({ message: 'Неверный формат отправки данных' });
      }

      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};
