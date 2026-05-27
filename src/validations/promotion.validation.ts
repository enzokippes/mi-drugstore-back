import { body } from 'express-validator';

export const promotionValidation = [
  body('title')
    .isString().withMessage('title must be a string')
    .isLength({ min: 1, max: 100 }).withMessage('title must be between 1 and 100 characters'),
  body('description')
    .isString().withMessage('description must be a string')
    .isLength({ min: 1, max: 500 }).withMessage('description must be between 1 and 500 characters'),
  body('price')
    .isFloat({ gt: 0 }).withMessage('price must be a number greater than 0'),
  body('originalPrice')
    .optional()
    .isFloat({ gt: 0 }).withMessage('originalPrice must be a number greater than 0'),
];
