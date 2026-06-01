import { Request, Response } from 'express';
import * as popularService from '../services/popular.service';
import { sendSuccess, sendError } from '../utils/response';

export const getPopularProducts = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const days = parseInt(req.query.days as string) || 30;
    const products = await popularService.getPopularProductsService(limit, days);
    sendSuccess(res, products);
  } catch (error: any) {
    sendError(res, error.message || 'Error fetching popular products', 500);
  }
};

export const getFeaturedProducts = async (_req: Request, res: Response) => {
  try {
    const products = await popularService.getFeaturedProductsService();
    sendSuccess(res, products);
  } catch (error: any) {
    sendError(res, error.message || 'Error fetching featured products', 500);
  }
};

export const getPopularSuggestions = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const days = parseInt(req.query.days as string) || 30;
    const suggestions = await popularService.getPopularSuggestionsService(limit, days);
    sendSuccess(res, suggestions);
  } catch (error: any) {
    sendError(res, error.message || 'Error fetching suggestions', 500);
  }
};
