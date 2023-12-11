import { celebrate, Joi } from "celebrate";
import { Router } from "express";
import {
  getCards,
  createCard,
  deleteCard,
  putLikeOnCard,
  removeLikeFromCard,
} from "../controllers/cards";

const cardsRouter = Router();

cardsRouter.get("/", getCards);

cardsRouter.post(
  "/",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required(),
    }),
  }),
  createCard
);

cardsRouter.delete(
  "/:cardId",
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string(),
    }),
  }),
  deleteCard
);

cardsRouter.put(
  "/:cardId/likes",
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string(),
    }),
  }),
  putLikeOnCard
);

cardsRouter.delete(
  "/:cardId/likes",
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string(),
    }),
  }),
  removeLikeFromCard
);

export default cardsRouter;
