import 'express-async-errors';
import 'dotenv/config';
import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import rateLimiter from '@shared/infra/http/middlewares/rateLimiter';
import cors from 'cors';
import uploadConfig from '@config/uploads';
import AppError from '@shared/errors/AppError';
import { errors } from 'celebrate';
import routes from './routes';

import '@shared/infra/typeorm'; // Database connection
import '@shared/container';

const app = express();

app.use(cors());

app.use(express.json());

app.use(routes);

app.use(errors());

app.use('/files', express.static(uploadConfig.uploadsDir));

app.use(rateLimiter);

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response
      .status(err.statusCode)
      .json({ status: 'error', message: err.message });
  }

  return response.status(500).json({
    status: 'error',
    message: `Internal server error: ${err.message}`,
  });
});

app.listen(3333, () => {
  // eslint-disable-next-line no-console
  console.log('🚀 For the up and away! 🚀');
});
