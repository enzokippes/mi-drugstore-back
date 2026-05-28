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
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error creating order';
    sendError(res, message, 400);
  }
};

export const getMyOrders = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const orders = await orderService.getUserOrdersService(userId);
    sendSuccess(res, orders);
  } catch (error: unknown) {
    sendError(res, 'Error fetching orders', 500);
  }
};

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await orderService.getAllOrdersService();
    sendSuccess(res, orders);
  } catch (error: unknown) {
    sendError(res, 'Error fetching orders', 500);
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { status } = req.body;
    const order = await orderService.updateOrderStatusService(id, status);
    sendSuccess(res, order, 'Order status updated');
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error updating order status';
    sendError(res, message, 400);
  }
};
