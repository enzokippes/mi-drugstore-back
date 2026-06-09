import { Request, Response } from 'express';
import * as loyaltyService from '../services/loyalty.service';
import { sendSuccess, sendError } from '../utils/response';

export const getMyPoints = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const result = await loyaltyService.getUserPointsService(userId);
    sendSuccess(res, result);
  } catch (error: any) {
    sendError(res, error.message || 'Error fetching points', 500);
  }
};

export const getMyPointsHistory = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const history = await loyaltyService.getUserPointsHistoryService(userId);
    sendSuccess(res, history);
  } catch (error: any) {
    sendError(res, error.message || 'Error fetching points history', 500);
  }
};

export const getRewards = async (_req: Request, res: Response) => {
  try {
    const rewards = await loyaltyService.getActiveRewardsService();
    sendSuccess(res, rewards);
  } catch (error: any) {
    sendError(res, error.message || 'Error fetching rewards', 500);
  }
};

export const redeemPoints = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { rewardId } = req.body;
    const result = await loyaltyService.redeemPointsService(userId, rewardId);
    sendSuccess(res, result, 'Puntos canjeados exitosamente');
  } catch (error: any) {
    sendError(res, error.message || 'Error redeeming points', 400);
  }
};

export const validateRewardForCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { rewardId } = req.body;
    const result = await loyaltyService.validateRewardForCartService(userId, rewardId);
    sendSuccess(res, result);
  } catch (error: any) {
    sendError(res, error.message || 'Error validating reward', 400);
  }
};

export const awardPoints = async (req: Request, res: Response) => {
  try {
    const { userId, points, reason } = req.body;
    const result = await loyaltyService.awardPointsService(userId, points, reason || 'BONUS');
    sendSuccess(res, result, 'Puntos otorgados exitosamente', 201);
  } catch (error: any) {
    sendError(res, error.message || 'Error awarding points', 400);
  }
};

export const getAllRewards = async (_req: Request, res: Response) => {
  try {
    const rewards = await loyaltyService.getAllRewardsService();
    sendSuccess(res, rewards);
  } catch (error: any) {
    sendError(res, error.message || 'Error fetching rewards', 500);
  }
};

export const getRewardById = async (req: Request, res: Response) => {
  try {
    const reward = await loyaltyService.getRewardByIdService(req.params.id as string);
    if (!reward) {
      return sendError(res, 'Reward not found', 404);
    }
    sendSuccess(res, reward);
  } catch (error: any) {
    sendError(res, error.message || 'Error fetching reward', 500);
  }
};

export const createReward = async (req: Request, res: Response) => {
  try {
    const reward = await loyaltyService.createRewardService(req.body);
    sendSuccess(res, reward, 'Reward created successfully', 201);
  } catch (error: any) {
    sendError(res, error.message || 'Error creating reward', 400);
  }
};

export const updateReward = async (req: Request, res: Response) => {
  try {
    const reward = await loyaltyService.updateRewardService(req.params.id as string, req.body);
    sendSuccess(res, reward, 'Reward updated successfully');
  } catch (error: any) {
    sendError(res, error.message || 'Error updating reward', 400);
  }
};

export const deleteReward = async (req: Request, res: Response) => {
  try {
    await loyaltyService.deleteRewardService(req.params.id as string);
    sendSuccess(res, null, 'Reward deleted successfully');
  } catch (error: any) {
    sendError(res, error.message || 'Error deleting reward', 400);
  }
};
