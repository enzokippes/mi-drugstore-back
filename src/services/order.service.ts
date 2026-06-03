import prisma from '../config/db';
import { sendOrderConfirmation, sendAdminOrderNotification, sendStatusChangeEmail } from './email.service';
import { awardPointsForOrderService } from './loyalty.service';

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
  deliveryZoneId?: string;
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

  let deliveryCost = 0;
  if (data.deliveryType === 'DELIVERY' && data.deliveryZoneId) {
    const zone = await prisma.deliveryZone.findUnique({ where: { id: data.deliveryZoneId } });
    if (zone && zone.active) {
      deliveryCost = zone.basePrice + zone.surcharge;
    }
  }

  const order = await prisma.order.create({
    data: {
      userId: data.userId,
      total: data.total + deliveryCost,
      deliveryType: data.deliveryType,
      deliveryCost,
      deliveryZoneId: data.deliveryZoneId || null,
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
      deliveryZone: true,
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
      },
      deliveryZone: true,
    },
    orderBy: {
      createdAt: 'desc',
    }
  });
};

export const getAllOrdersService = async (params: {
  page?: number;
  limit?: number;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  deliveryType?: string;
}) => {
  const { page = 1, limit = 20, status, dateFrom, dateTo, search, deliveryType } = params;
  const skip = (page - 1) * limit;

  const where: any = {};

  if (status && status !== 'ALL') {
    where.status = status;
  }

  if (deliveryType && deliveryType !== 'ALL') {
    where.deliveryType = deliveryType;
  }

  if (dateFrom || dateTo) {
    where.createdAt = {};
    if (dateFrom) where.createdAt.gte = new Date(dateFrom);
    if (dateTo) where.createdAt.lte = new Date(dateTo + 'T23:59:59.999');
  }

  if (search) {
    where.OR = [
      { id: { contains: search } },
      { user: { name: { contains: search, mode: 'insensitive' } } },
      { user: { email: { contains: search, mode: 'insensitive' } } },
      { address: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        items: {
          include: { product: true },
        },
        deliveryZone: true,
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);

  return { items, total, page, limit };
};

export const updateOrderStatusService = async (orderId: string, status: string) => {
  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status },
    include: {
      items: true,
      deliveryZone: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (status === 'CONFIRMED' && order.user) {
    const itemsTotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    await awardPointsForOrderService(order.user.id, itemsTotal, order.id).catch(() => {});
  }

  if (status === 'CANCELLED') {
    for (const item of order.items) {
      if (item.productId) {
        const product = await prisma.product.findUnique({ where: { id: item.productId } });
        if (product && !product.unlimitedStock) {
          await prisma.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
        }
      }
    }
  }

  if (order.user?.email && ['CONFIRMED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'].includes(status)) {
    sendStatusChangeEmail(order.user.email, order.id, status).catch(() => {});
  }

  return order;
};
