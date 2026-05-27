import { Request, Response } from 'express';
import * as promotionService from '../services/promotion.service';
import { sendSuccess, sendError } from '../utils/response';

export const getPromotions = async (_req: Request, res: Response) => {
  try {
    const promotions = await promotionService.getPromotionsService();
    sendSuccess(res, promotions);
  } catch (error: any) {
    sendError(res, error.message || 'Error fetching promotions', 500);
  }
};

export const getActivePromotions = async (_req: Request, res: Response) => {
  try {
    const promotions = await promotionService.getPromotionsService(true);
    sendSuccess(res, promotions);
  } catch (error: any) {
    sendError(res, error.message || 'Error fetching promotions', 500);
  }
};

export const getPromotionById = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const promotion = await promotionService.getPromotionByIdService(id);
    if (!promotion) {
      return sendError(res, 'Promotion not found', 404);
    }
    sendSuccess(res, promotion);
  } catch (error: any) {
    sendError(res, error.message || 'Error fetching promotion', 500);
  }
};

export const createPromotion = async (req: Request, res: Response) => {
  try {
    const { title, description, price, originalPrice, active, startDate, endDate } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : undefined;

    const promotion = await promotionService.createPromotionService({
      title,
      description,
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      image,
      active: active === 'true' || active === true || active === undefined,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });
    sendSuccess(res, promotion, 'Promotion created successfully', 201);
  } catch (error: any) {
    sendError(res, error.message || 'Error creating promotion', 400);
  }
};

export const updatePromotion = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { title, description, price, originalPrice, active, startDate, endDate } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : undefined;

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (originalPrice !== undefined) updateData.originalPrice = originalPrice ? parseFloat(originalPrice) : null;
    if (active !== undefined) updateData.active = active === 'true' || active === true;
    if (startDate !== undefined) updateData.startDate = startDate ? new Date(startDate) : null;
    if (endDate !== undefined) updateData.endDate = endDate ? new Date(endDate) : null;
    if (image) updateData.image = image;

    const promotion = await promotionService.updatePromotionService(id, updateData);
    sendSuccess(res, promotion, 'Promotion updated successfully');
  } catch (error: any) {
    sendError(res, error.message || 'Error updating promotion', 400);
  }
};

export const deletePromotion = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await promotionService.deletePromotionService(id);
    sendSuccess(res, null, 'Promotion deleted successfully');
  } catch (error: any) {
    sendError(res, error.message || 'Error deleting promotion', 400);
  }
};
