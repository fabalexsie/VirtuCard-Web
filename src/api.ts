import express from 'express';
import { personRouter } from './apiPerson';
import { templateRouter } from './apiTemplate';

export const apiRouter = express.Router();

apiRouter.use(express.json());

apiRouter.use('/p', personRouter);
apiRouter.use('/t', templateRouter);

apiRouter.get('/config', (req, res) => {
  res.send({
    newPersonsAllowed: JSON.parse(process.env.NEW_PERSONS_ALLOWED ?? 'false'),
    newTemplatesAllowed: JSON.parse(
      process.env.NEW_TEMPLATES_ALLOWED ?? 'false',
    ),
  });
});
