import { Request, Response } from 'express';
import * as productService from '../services/product.service';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await productService.getProductsService();
    res.status(200).json(products);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching products' });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await productService.getProductByIdService(req.params.id as string);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching product' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await productService.createProductService(req.body);
    res.status(201).json(product);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Error creating product' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await productService.updateProductService(req.params.id as string, req.body);
    res.status(200).json(product);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Error updating product' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    await productService.deleteProductService(req.params.id as string);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Error deleting product' });
  }
};
