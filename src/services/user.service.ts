import prisma from '../config/db';
import { awardPointsService } from './loyalty.service';

export const getUsersService = async (params: {
  page: number;
  limit: number;
  search?: string;
  role?: string;
  banned?: boolean | string;
}) => {
  const { page, limit, search, role, banned } = params;
  const skip = (page - 1) * limit;

  const where: any = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (role && (role === 'USER' || role === 'ADMIN')) {
    where.role = role;
  }

  if (banned !== undefined && banned !== 'all') {
    where.banned = banned === 'true' || banned === true;
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        banned: true,
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count({ where }),
  ]);

  const userIds = users.map((u) => u.id);

  const [pointsAgg, orderCounts] = await Promise.all([
    prisma.loyaltyPoint.groupBy({
      by: ['userId'],
      where: { userId: { in: userIds } },
      _sum: { points: true },
    }),
    prisma.order.groupBy({
      by: ['userId'],
      where: { userId: { in: userIds } },
      _count: { id: true },
    }),
  ]);

  const pointsMap = new Map(pointsAgg.map((p) => [p.userId, p._sum.points || 0]));
  const ordersMap = new Map(orderCounts.map((o) => [o.userId, o._count.id]));

  const usersWithMeta = users.map((user) => ({
    ...user,
    totalPoints: pointsMap.get(user.id) || 0,
    orderCount: ordersMap.get(user.id) || 0,
  }));

  return {
    items: usersWithMeta,
    total,
    page,
    limit,
  };
};

export const getUserByIdService = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      banned: true,
    },
  });

  if (!user) return null;

  const [pointsAgg, orderCount] = await Promise.all([
    prisma.loyaltyPoint.aggregate({
      where: { userId: id },
      _sum: { points: true },
    }),
    prisma.order.count({
      where: { userId: id },
    }),
  ]);

  return {
    ...user,
    totalPoints: pointsAgg._sum.points || 0,
    orderCount,
  };
};

export const updateUserService = async (
  id: string,
  data: { name?: string; email?: string; phone?: string | null; role?: string },
) => {
  return await prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      banned: true,
    },
  });
};

export const toggleBanService = async (id: string, banned: boolean) => {
  return await prisma.user.update({
    where: { id },
    data: { banned },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      banned: true,
    },
  });
};

export const deleteUserService = async (id: string) => {
  await prisma.loyaltyPoint.deleteMany({ where: { userId: id } });
  await prisma.address.deleteMany({ where: { userId: id } });

  const orders = await prisma.order.findMany({
    where: { userId: id },
    select: { id: true },
  });
  const orderIds = orders.map((o) => o.id);

  if (orderIds.length > 0) {
    await prisma.orderItem.deleteMany({ where: { orderId: { in: orderIds } } });
    await prisma.order.deleteMany({ where: { userId: id } });
  }

  return await prisma.user.delete({ where: { id } });
};

export const adjustPointsService = async (userId: string, points: number, reason: string) => {
  return await awardPointsService(userId, points, reason);
};
