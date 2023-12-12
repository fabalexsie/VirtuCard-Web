import express from 'express';
import { randomUUID } from 'crypto';
import { createEmptyPerson, getPerson, updatePerson } from './db';
import { NewPersonResponse } from '../frontend/src/utils/data';
import humanId from 'human-id';

export const personRouter = express.Router();

if (JSON.parse(process.env.NEW_PERSONS_ALLOWED ?? 'false')) {
  personRouter.get('/suggestUsername', (req, res) => {
    const usernameWithVerb = humanId({
      addAdverb: false,
      adjectiveCount: 1,
      separator: '-',
      capitalize: false,
    });
    const username = usernameWithVerb.substring(
      0,
      usernameWithVerb.lastIndexOf('-'),
    );
    res.send({ username });
  });

  personRouter.get('/new?name=:personid', (req, res) => {
    const newPersonId = req.query.personId as string;
    const password = randomUUID();
    createEmptyPerson(newPersonId, password);
    res.send({ personId: newPersonId, editpw: password } as NewPersonResponse);
  });
}

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
