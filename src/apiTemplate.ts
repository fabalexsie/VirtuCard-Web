import express from 'express';
//import { randomUUID } from 'crypto';
import { getTemplate } from './db';
//import { humanId } from 'human-id';

export const templateRouter = express.Router();

templateRouter.get('/new', (req, res) => {
  //const newTemplateId = humanId();
  //const password = randomUUID();
  //createNewDefaultTemplate(newTemplateId, password);
  //res.send({ personId: newTemplateId, editpw: password });
  res.sendStatus(404);
});

templateRouter.get('/:userid', (req, res) => {
  res.send(getTemplate(req.params.userid));
});

templateRouter.put('/:userid/:editpw', () => {
  /*updatePerson(req.params.userid, req.params.editpw, req.body).then(
    (success) => {
      if (success) {
        res.send({ success, msg: 'Saved' });
      } else {
        res
          .status(401)
          .send({ success, msg: 'For example wrong edit password' });
      }
    },
  );*/
});
