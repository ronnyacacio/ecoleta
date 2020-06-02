import express, { json } from 'express';

import routes from './routes';

const app = express();

app.use(json());
app.use(routes);

const port = process.env.PORT || 3333;

app.listen(port, () => {
  console.log(`🔥 Server started at http://localhost:${port}`);
});
