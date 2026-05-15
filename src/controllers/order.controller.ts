import { Request, Response } from 'express';
import * as orderService from '../services/order.service';

export const createOrder = async (req: Request, res: Response) => {
  try {
    // Basic validation could go here, but we leave it raw for the "Plus"
    const { total, items } = req.body;
    const userId = (req as any).user.id; // From auth middleware

    const order = await orderService.createOrderService({
      userId,
      total,
      items,
    });
    
    res.status(201).json(order);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Error creating order' });
  }
};

export const getMyOrders = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const orders = await orderService.getUserOrdersService(userId);
    res.status(200).json(orders);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching orders' });
  }
};
