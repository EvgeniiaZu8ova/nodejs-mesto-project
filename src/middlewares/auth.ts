import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import NotAuthError from '../errors/not-auth-err';

export default (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt;

  if (!token) {
    next(new NotAuthError('Необходима авторизация'));
    return;
  }

  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    const error = new NotAuthError('Необходима авторизация');
    next(error);
  }

  req.user = payload as { _id: string };

  next();
};
