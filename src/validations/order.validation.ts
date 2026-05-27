import { body } from 'express-validator';

export const orderValidation = [
  body('total')
    .isFloat({ gt: 0 }).withMessage('total must be a number greater than 0'),
  body('items')
    .isArray({ min: 1 }).withMessage('items must be a non-empty array'),
  body('items.*.productId')
    .isString().notEmpty().withMessage('productId is required'),
  body('items.*.quantity')
    .isInt({ min: 1 }).withMessage('quantity must be an integer >= 1'),
  body('items.*.price')
    .isFloat({ gt: 0 }).withMessage('price must be a number greater than 0'),
  body('deliveryType')
    .isIn(['PICKUP', 'DELIVERY']).withMessage('deliveryType must be PICKUP or DELIVERY'),
  body('address')
    .if(body('deliveryType').equals('DELIVERY'))
    .isString().isLength({ min: 5 }).withMessage('address is required for delivery (min 5 chars)'),
  body('phone')
    .if(body('deliveryType').equals('DELIVERY'))
    .isString().notEmpty().withMessage('phone is required for delivery'),
  body('deliveryTime')
    .if(body('deliveryType').equals('DELIVERY'))
    .isString().notEmpty().withMessage('deliveryTime is required for delivery'),
];
