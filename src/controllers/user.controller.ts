import { Request, Response } from 'express';
import * as userService from '../services/user.service';
import { sendSuccess, sendError } from '../utils/response';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string | undefined;
    const role = req.query.role as string | undefined;
    const banned = req.query.banned as string | undefined;

    const result = await userService.getUsersService({ page, limit, search, role, banned });
    sendSuccess(res, result);
  } catch (error: any) {
    sendError(res, error.message || 'Error fetching users', 500);
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id as string;
    const user = await userService.getUserByIdService(userId);
    if (!user) {
      return sendError(res, 'Usuario no encontrado', 404);
    }
    sendSuccess(res, user);
  } catch (error: any) {
    sendError(res, error.message || 'Error fetching user', 500);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id as string;
    const user = await userService.updateUserService(userId, req.body);
    sendSuccess(res, user, 'Usuario actualizado exitosamente');
  } catch (error: any) {
    if (error.code === 'P2002') {
      return sendError(res, 'El email ya esta en uso', 400);
    }
    sendError(res, error.message || 'Error updating user', 400);
  }
};

export const banUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id as string;
    const { banned } = req.body;
    const user = await userService.toggleBanService(userId, banned);
    sendSuccess(res, user, banned ? 'Usuario baneado' : 'Usuario desbaneado');
  } catch (error: any) {
    sendError(res, error.message || 'Error updating ban status', 400);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id as string;
    await userService.deleteUserService(userId);
    sendSuccess(res, null, 'Usuario eliminado exitosamente');
  } catch (error: any) {
    sendError(res, error.message || 'Error deleting user', 400);
  }
};

export const adjustPoints = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id as string;
    const { points, reason } = req.body;
    const result = await userService.adjustPointsService(userId, points, reason);
    sendSuccess(res, result, 'Puntos ajustados exitosamente', 201);
  } catch (error: any) {
    sendError(res, error.message || 'Error adjusting points', 400);
  }
};
