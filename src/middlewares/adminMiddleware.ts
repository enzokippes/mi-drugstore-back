import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || (req.user as any).role !== 'ADMIN') {
    return sendError(res, 'Admin access required', 403);
  }
  next();
};
