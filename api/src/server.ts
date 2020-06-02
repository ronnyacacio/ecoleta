import express from 'express';

const app = express();

app.get('/', (req, res) => {
  return res.json({ message: 'Hello World' });
});

const port = process.env.PORT || 3333;

app.listen(port, () => {
  console.log(`🔥 Server started at http://localhost:${port}`);
});
