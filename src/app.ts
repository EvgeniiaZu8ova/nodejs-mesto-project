import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import router from "./routes";

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/mestodb");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  // @ts-ignore
  req.user = {
    _id: "656eed2b190acb233c8c2397",
  };

  next();
});

app.use(router);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
