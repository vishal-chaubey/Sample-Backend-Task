import { check } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { appResponseMessage } from "../utils/appResponseMessage";
import { appResponseStatus } from "../utils/appResponseStatus";

export const validate = (method: string) => {
  switch (method) {
    case 'task': {
      return [
        check('title').not().isEmpty().withMessage('The title field is required.'),
        check('description').not().isEmpty().withMessage('The description field is required.'),
        check('timeline')
          .notEmpty().withMessage('The timeline field is required.')
          .isISO8601().withMessage('The timeline must be a valid ISO 8601 date.')
      ];
    }
    default:
return [];
  }
};
