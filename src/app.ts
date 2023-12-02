import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import cardsRouter from './routes/cards';
import usersRouter from './routes/users';

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  // @ts-ignore
  req.user = {
    _id: '656b320ab6b17e3d438e29ee',
  };

  next();
});

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
