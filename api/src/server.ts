import express, { json } from 'express';
import { resolve } from 'path';

import routes from './routes';

const app = express();

app.use(json());
app.use(routes);
app.use('/uploads', express.static(resolve(__dirname, '..', 'uploads')));

const port = process.env.PORT || 3333;

app.listen(port, () => {
  console.log(`🔥 Server started at http://localhost:${port}`);
});
