import prisma from '../config/db';
import { sendOrderConfirmation, sendAdminOrderNotification } from './email.service';

interface OrderItemInput {
  productId: string;
  quantity: number;
  price: number;
}

interface CreateOrderInput {
  userId: string;
  total: number;
  items: OrderItemInput[];
  deliveryType: string;
  address?: string;
  phone?: string;
  notes?: string;
  deliveryTime?: string;
}

export const createOrderService = async (data: CreateOrderInput) => {
  const orderItems = [];
  for (const item of data.items) {
    if (item.productId.startsWith('promo-')) {
      const promoId = item.productId.replace('promo-', '');
      const promo = await prisma.promotion.findUnique({ where: { id: promoId } });
      orderItems.push({
        quantity: item.quantity,
        price: item.price,
        productName: promo ? promo.title : 'Promoción',
        productId: null,
      });
    } else {
      orderItems.push({
        quantity: item.quantity,
        price: item.price,
        productId: item.productId,
      });
    }
  }

  const order = await prisma.order.create({
    data: {
      userId: data.userId,
      total: data.total,
      deliveryType: data.deliveryType,
      address: data.address || null,
      phone: data.phone || null,
      notes: data.notes || null,
      deliveryTime: data.deliveryTime || null,
      items: {
        create: orderItems,
      },
    },
    include: {
      items: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  for (const item of data.items) {
    if (!item.productId.startsWith('promo-')) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (product && !product.unlimitedStock) {
        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }
    }
  }

  if (order.user?.email) {
    sendOrderConfirmation(order.user.email, order).catch(() => {});
  }
  sendAdminOrderNotification(order).catch(() => {});

  return order;
};

export const getUserOrdersService = async (userId: string) => {
  return await prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          product: true,
        }
      }
    },
    orderBy: {
      createdAt: 'desc',
    }
  });
};

export const getAllOrdersService = async () => {
  return await prisma.order.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const updateOrderStatusService = async (orderId: string, status: string) => {
  return await prisma.order.update({
    where: { id: orderId },
    data: { status },
    include: {
      items: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

export const updatePaymentStatusService = async (orderId: string, paymentStatus: string, paymentId?: string) => {
  return await prisma.order.update({
    where: { id: orderId },
    data: { paymentStatus, paymentId },
  });
};
