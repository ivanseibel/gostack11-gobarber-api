import 'express-async-errors';
import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import routes from './routes';
import uploadConfig from './config/uploads';
import './database';
import AppError from './errors/AppError';

const app = express();

app.use(cors());

app.use(express.json());

app.use(routes);

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response
      .status(err.statusCode)
      .json({ status: 'error', message: err.message });
  }

  return response
    .status(500)
    .json({ status: 'error', message: 'Internal server error' });
});

app.use('/files', express.static(uploadConfig.avatarDir));

app.listen(3333, () => {
  // eslint-disable-next-line no-console
  console.log('🚀 Para o alto e avante! 🚀');
});
