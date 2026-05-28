import { ZodSchema } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const validateZod = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.issues.map(e => ({
        field: e.path.map(String).join('.'),
        message: e.message,
      }));
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
      return;
    }
    req.body = result.data;
    next();
  };
};
