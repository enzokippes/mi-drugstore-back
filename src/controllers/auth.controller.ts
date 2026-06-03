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

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    await authService.forgotPasswordService(email);
    sendSuccess(res, null, 'Email de recuperacion enviado si el usuario existe');
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error al procesar solicitud';
    sendError(res, message, 400);
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;
    await authService.resetPasswordService(token, password);
    sendSuccess(res, null, 'Contraseña actualizada con exito');
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error al resetear contraseña';
    sendError(res, message, 400);
  }
};
