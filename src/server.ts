import 'reflect-metadata';
import express from 'express';
import routes from './routes';
import uploadConfig from './config/uploads';

import './database';

const app = express();

app.use(express.json());

app.use(routes);

app.use('/files', express.static(uploadConfig.avatarDir));

app.listen(3333, () => {
  // eslint-disable-next-line no-console
  console.log('🚀 Para o alto e avante! 🚀');
});
