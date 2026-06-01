import { Request, Response } from 'express';
import * as statsService from '../services/stats.service';
import { sendSuccess, sendError } from '../utils/response';

export const getAdminStats = async (_req: Request, res: Response) => {
  try {
    const stats = await statsService.getAdminStatsService();
    sendSuccess(res, stats);
  } catch (error: any) {
    sendError(res, error.message || 'Error fetching stats', 500);
  }
};
