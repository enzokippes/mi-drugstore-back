import { Request, Response } from 'express';
import * as paymentService from '../services/payment.service';
import * as orderService from '../services/order.service';
import { sendSuccess, sendError } from '../utils/response';
import prisma from '../config/db';

export const createPreference = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.body;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!order) {
      sendError(res, 'Order not found', 404);
      return;
    }

    const items = order.items.map(item => ({
      title: item.productName || item.product?.name || 'Producto',
      quantity: item.quantity,
      unitPrice: item.price,
    }));

    const preference = await paymentService.createPaymentPreference(items, order.id);

    sendSuccess(res, preference, 'Payment preference created');
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error creating payment preference';
    sendError(res, message, 400);
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  try {
    const { type, data } = req.body;

    if (type === 'payment') {
      const paymentId = data.id;
      const paymentInfo = req.body.data;

      const orderId = paymentInfo?.external_reference;
      const status = paymentInfo?.status;

      if (orderId) {
        let paymentStatus = 'PENDING';
        if (status === 'approved') paymentStatus = 'PAID';
        else if (status === 'rejected') paymentStatus = 'REJECTED';

        await orderService.updatePaymentStatusService(orderId, paymentStatus, paymentId);

        if (status === 'approved') {
          await orderService.updateOrderStatusService(orderId, 'CONFIRMED');
        }
      }
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
};
