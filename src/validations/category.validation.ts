import { body } from 'express-validator';

export const categoryValidation = [
  body('name')
    .isString().withMessage('name must be a string')
    .isLength({ min: 1, max: 50 }).withMessage('name must be between 1 and 50 characters'),
];
