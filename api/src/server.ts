import express, { json } from 'express';
import cors from 'cors';
import { resolve } from 'path';
import { errors } from 'celebrate';

import routes from './routes';

const app = express();

app.use(cors());
app.use(json());
app.use(routes);
app.use('/uploads', express.static(resolve(__dirname, '..', 'uploads')));
app.use(errors());

const port = process.env.PORT || 3333;

app.listen(port, () => {
  console.log(`🔥 Server started at http://localhost:${port}`);
});
