import express from 'express';

export const apiRouter = express.Router();

apiRouter.get('/:userid', (req, res) => {
  res.send({ data: 'API is available' });
});

apiRouter.put('/:userid/:editpw', (req, res) => {
  res.send({ data: 'API is updated' });
});
