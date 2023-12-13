import { celebrate, Joi } from "celebrate";
import http2 from "http2";
import { createUser, login } from "./controllers/users";
import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import router from "./routes";
import auth from "./middlewares/auth";
import { requestLogger, errorLogger } from "./middlewares/logger";

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/mestodb");

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(requestLogger);

app.post(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login
);

app.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(200),
      avatar: Joi.string(),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  createUser
);

app.use(auth);

app.use(router);

app.use(errorLogger);

app.use(
  (
    err: Error & { statusCode: number },
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const {
      statusCode = http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR,
      message,
    } = err;

    res.status(statusCode).send({
      message:
        statusCode === http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR
          ? "На сервере произошла ошибка"
          : message,
    });
  }
);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
