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
}

export const createOrderService = async (data: CreateOrderInput) => {
  // Using Prisma transaction to ensure order and items are created together
  return await prisma.order.create({
    data: {
      userId: data.userId,
      total: data.total,
      items: {
        create: data.items.map(item => ({
          quantity: item.quantity,
          price: item.price,
          productId: item.productId,
        })),
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
