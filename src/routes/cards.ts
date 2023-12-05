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
cardsRouter.post("/", createCard);
cardsRouter.delete("/:cardId", deleteCard);
cardsRouter.put("/:cardId/likes", putLikeOnCard);
cardsRouter.delete("/:cardId/likes", removeLikeFromCard);

export default cardsRouter;
