import { Request, Response } from 'express';
import * as productService from '../services/product.service';
import { sendSuccess, sendError } from '../utils/response';

export const getProducts = async (_req: Request, res: Response) => {
  try {
    const products = await productService.getProductsService();
    sendSuccess(res, products);
  } catch (error: any) {
    sendError(res, error.message || 'Error fetching products', 500);
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const product = await productService.getProductByIdService(id);
    if (!product) {
      return sendError(res, 'Product not found', 404);
    }
    sendSuccess(res, product);
  } catch (error: any) {
    sendError(res, error.message || 'Error fetching product', 500);
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, price, stock, unlimitedStock, categoryId, isCombo } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : undefined;

    const product = await productService.createProductService({
      name,
      price: parseFloat(price),
      stock: parseInt(stock, 10) || 0,
      unlimitedStock: unlimitedStock === 'true' || unlimitedStock === true,
      isCombo: isCombo === 'true' || isCombo === true,
      image,
      categoryId,
    });
    sendSuccess(res, product, 'Product created successfully', 201);
  } catch (error: any) {
    sendError(res, error.message || 'Error creating product', 400);
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { name, price, stock, unlimitedStock, categoryId, isCombo } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : undefined;

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (stock !== undefined) updateData.stock = parseInt(stock, 10) || 0;
    if (unlimitedStock !== undefined) updateData.unlimitedStock = unlimitedStock === 'true' || unlimitedStock === true;
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (isCombo !== undefined) updateData.isCombo = isCombo === 'true' || isCombo === true;
    if (image) updateData.image = image;

    const product = await productService.updateProductService(id, updateData);
    sendSuccess(res, product, 'Product updated successfully');
  } catch (error: any) {
    sendError(res, error.message || 'Error updating product', 400);
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await productService.deleteProductService(id);
    sendSuccess(res, null, 'Product deleted successfully');
  } catch (error: any) {
    sendError(res, error.message || 'Error deleting product', 400);
  }
};
