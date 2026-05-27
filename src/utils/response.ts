import { Response } from 'express';

export const sendSuccess = (res: Response, data: any = null, message: string = 'OK', statusCode: number = 200) => {
  return res.status(statusCode).json({
    success: true,
    data,
    message,
  });
};

export const sendError = (res: Response, message: string = 'Error', statusCode: number = 400, data: any = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(data && { data }),
  });
};
