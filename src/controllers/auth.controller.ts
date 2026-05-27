import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import { sendSuccess, sendError } from '../utils/response';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const result = await authService.registerService(name, email, password);
    sendSuccess(res, result, 'User registered successfully', 201);
  } catch (error: any) {
    sendError(res, error.message || 'Error registering user', 400);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginService(email, password);
    sendSuccess(res, result, 'Login successful');
  } catch (error: any) {
    sendError(res, error.message || 'Error logging in', 400);
  }
};
