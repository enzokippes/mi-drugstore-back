import { body } from 'express-validator';

export const productValidation = [
  body('name')
    .isString().withMessage('name must be a string')
    .isLength({ min: 1, max: 100 }).withMessage('name must be between 1 and 100 characters'),
  body('price')
    .isFloat({ gt: 0 }).withMessage('price must be a number greater than 0'),
  body('stock')
    .optional()
    .isInt({ min: 0 }).withMessage('stock must be an integer >= 0'),
  body('categoryId')
    .isString().notEmpty().withMessage('categoryId is required'),
  body('isCombo')
    .optional()
    .isIn(['true', 'false', true, false]).withMessage('isCombo must be a boolean'),
];
