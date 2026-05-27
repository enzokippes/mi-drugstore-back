import { Request, Response } from 'express';
import * as settingsService from '../services/settings.service';
import { sendSuccess, sendError } from '../utils/response';

export const getSettings = async (_req: Request, res: Response) => {
  try {
    const settings = await settingsService.getAllSettings();
    sendSuccess(res, settings);
  } catch (error: any) {
    sendError(res, error.message || 'Error fetching settings', 500);
  }
};

export const updateSetting = async (req: Request, res: Response) => {
  try {
    const { key, value } = req.body;
    if (!key || value === undefined) {
      return sendError(res, 'key and value are required', 400);
    }
    await settingsService.setSetting(key, String(value));
    sendSuccess(res, { key, value }, 'Setting updated');
  } catch (error: any) {
    sendError(res, error.message || 'Error updating setting', 400);
  }
};
