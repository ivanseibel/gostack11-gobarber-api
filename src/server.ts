import express from 'express';
import routes from './routes';

const app = express();

app.use(express.json())

app.get('/', (request, response) => {
  const {name, email} = request.body;

  const user = {
    name,
    email
  }

  return response.json(user);
});

app.listen(3333, () => {
  console.log('🚀 Para o alto e avante! 🚀');
});
