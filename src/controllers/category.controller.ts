import { Request, Response } from 'express';
import * as categoryService from '../services/category.service';
import { sendSuccess, sendError } from '../utils/response';

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await categoryService.getCategoriesService();
    sendSuccess(res, categories);
  } catch (error: any) {
    sendError(res, error.message || 'Error fetching categories', 500);
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const category = await categoryService.getCategoryByIdService(req.params.id as string);
    if (!category) {
      return sendError(res, 'Category not found', 404);
    }
    sendSuccess(res, category);
  } catch (error: any) {
    sendError(res, error.message || 'Error fetching category', 500);
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const category = await categoryService.createCategoryService(req.body);
    sendSuccess(res, category, 'Category created successfully', 201);
  } catch (error: any) {
    sendError(res, error.message || 'Error creating category', 400);
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const category = await categoryService.updateCategoryService(req.params.id as string, req.body);
    sendSuccess(res, category, 'Category updated successfully');
  } catch (error: any) {
    sendError(res, error.message || 'Error updating category', 400);
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    await categoryService.deleteCategoryService(req.params.id as string);
    sendSuccess(res, null, 'Category deleted successfully');
  } catch (error: any) {
    sendError(res, error.message || 'Error deleting category', 400);
  }
};
