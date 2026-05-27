import { Request, Response } from 'express';
import * as orderService from '../services/order.service';
import { sendSuccess, sendError } from '../utils/response';

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { total, items, deliveryType, address, phone, notes, deliveryTime } = req.body;
    const userId = (req as any).user.id;

    const order = await orderService.createOrderService({
      userId,
      total,
      items,
      deliveryType: deliveryType || 'PICKUP',
      address,
      phone,
      notes,
      deliveryTime,
    });

    sendSuccess(res, order, 'Order created successfully', 201);
  } catch (error: any) {
    sendError(res, error.message || 'Error creating order', 400);
  }
};

export const getMyOrders = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const orders = await orderService.getUserOrdersService(userId);
    sendSuccess(res, orders);
  } catch (error: any) {
    sendError(res, error.message || 'Error fetching orders', 500);
  }
};
