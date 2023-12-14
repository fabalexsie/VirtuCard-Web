import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import { apiRouter } from './api';

const port = process.env.PORT;

const app = express();

app.use(
  express.static('frontend/build', {
    cacheControl: true,
    maxAge: 1000 * 60 * 60 * 24 * 10, // cache 10 days
  }),
);

app.use('/api', apiRouter);

// nothing else matches, so send index.html (react will handle the rest)
app.use('*', (req, res) => {
  res.sendFile('index.html', { root: 'frontend/build' });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
