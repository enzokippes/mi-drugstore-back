import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import { sendSuccess, sendError } from '../utils/response';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const result = await authService.registerService(name, email, password);
    sendSuccess(res, result, 'User registered successfully', 201);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error registering user';
    sendError(res, message, 400);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginService(email, password);
    sendSuccess(res, result, 'Login successful');
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error logging in';
    sendError(res, message, 400);
  }
};
