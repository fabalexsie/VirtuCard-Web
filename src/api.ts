import express from 'express';
import { personRouter } from './apiPerson';
import { templateRouter } from './apiTemplate';

export const apiRouter = express.Router();

apiRouter.use(express.json());

apiRouter.use('/p', personRouter);
apiRouter.use('/t', templateRouter);
