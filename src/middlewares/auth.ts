import { NotAuthError } from "../errors/not-auth-err";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export default (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt;

  if (!token) {
    throw new NotAuthError("Необходима авторизация");
  }

  let payload;

  try {
    payload = jwt.verify(token, "some-secret-key");
  } catch (err) {
    const error = new NotAuthError("Необходима авторизация");
    next(error);
  }

  // @ts-ignore
  req.user = payload;

  next();
};
