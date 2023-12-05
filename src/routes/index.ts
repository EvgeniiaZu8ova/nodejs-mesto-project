import http2 from "http2";
import { Router } from "express";
import cardsRouter from "./cards";
import usersRouter from "./users";

const router = Router();

router.use("/users", usersRouter);
router.use("/cards", cardsRouter);

router.all("*", (_, res) => {
  res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({
    message: "Несуществующий адрес запроса",
  });
});

export default router;
