import { Request, Response } from 'express';
import * as categoryService from '../services/category.service';

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await categoryService.getCategoriesService();
    res.status(200).json(categories);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching categories' });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const category = await categoryService.getCategoryByIdService(req.params.id as string);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching category' });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const category = await categoryService.createCategoryService(req.body);
    res.status(201).json(category);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Error creating category' });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const category = await categoryService.updateCategoryService(req.params.id as string, req.body);
    res.status(200).json(category);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Error updating category' });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    await categoryService.deleteCategoryService(req.params.id as string);
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Error deleting category' });
  }
};
