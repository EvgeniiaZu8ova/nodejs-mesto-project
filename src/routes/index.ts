import {
  NextFunction, Request, Response, Router,
} from 'express';
import NotFoundError from '../errors/not-found-err';
import cardsRouter from './cards';
import usersRouter from './users';

const router = Router();

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);

router.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError('Несуществующий адрес запроса'));
});

export default router;
