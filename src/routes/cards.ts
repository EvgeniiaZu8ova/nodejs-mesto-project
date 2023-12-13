import { celebrate, Joi } from 'celebrate';
import { Router } from 'express';
import { linkRegex } from '../utils';
import {
  getCards,
  createCard,
  deleteCard,
  putLikeOnCard,
  removeLikeFromCard,
} from '../controllers/cards';

const cardsRouter = Router();

cardsRouter.get('/', getCards);

cardsRouter.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().pattern(linkRegex),
    }),
  }),
  createCard,
);

cardsRouter.delete(
  '/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().hex(),
    }),
  }),
  deleteCard,
);

cardsRouter.put(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().hex(),
    }),
  }),
  putLikeOnCard,
);

cardsRouter.delete(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().hex(),
    }),
  }),
  removeLikeFromCard,
);

export default cardsRouter;
