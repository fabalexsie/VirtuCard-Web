import express from 'express';
import { createEmptyPerson, getPerson, updatePerson } from './db';
import { randomUUID } from 'crypto';

export const apiRouter = express.Router();

apiRouter.use(express.json());

apiRouter.get('/new-card', (req, res) => {
  const newPersonId = randomUUID();
  const password = randomUUID();
  createEmptyPerson(newPersonId, password);
  res.send({ personId: newPersonId, editpw: password });
});

apiRouter.get('/:userid', (req, res) => {
  res.send(getPerson(req.params.userid));
});

apiRouter.put('/:userid/:editpw', (req, res) => {
  updatePerson(req.params.userid, req.params.editpw, req.body).then(
    (success) => {
      if (success) {
        res.send({ success, msg: 'Saved' });
      } else {
        res
          .status(401)
          .send({ success, msg: 'For example wrong edit password' });
      }
    },
  );
});
