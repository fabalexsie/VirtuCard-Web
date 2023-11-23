import express from 'express';
import { randomUUID } from 'crypto';
import { createEmptyPerson, getPerson, updatePerson } from './db';

export const personRouter = express.Router();

personRouter.get('/new', (req, res) => {
  const newPersonId = randomUUID();
  const password = randomUUID();
  createEmptyPerson(newPersonId, password);
  res.send({ personId: newPersonId, editpw: password });
});

personRouter.get('/:userid', (req, res) => {
  res.send(getPerson(req.params.userid));
});

personRouter.put('/:userid/:editpw', (req, res) => {
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
