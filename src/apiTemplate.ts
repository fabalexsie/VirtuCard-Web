import express from 'express';
import { randomUUID } from 'crypto';
import { createNewDefaultTemplate, getTemplate, updateTemplate } from './db';
import { humanId } from 'human-id';
import { NewTemplateResponse } from '../frontend/src/utils/data';

export const templateRouter = express.Router();

templateRouter.get('/new', (req, res) => {
  const newTemplateId = humanId();
  const password = randomUUID();
  createNewDefaultTemplate(newTemplateId, password);
  res.send({
    templateId: newTemplateId,
    editpw: password,
  } as NewTemplateResponse);
});

templateRouter.get('/:templateid', (req, res) => {
  res.send(getTemplate(req.params.templateid));
});

templateRouter.put('/:templateid/:editpw', (req, res) => {
  updateTemplate(req.params.templateid, req.params.editpw, req.body).then(
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
