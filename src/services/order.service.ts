import prisma from '../config/db';

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

  return await prisma.order.create({
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
    },
  });
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
