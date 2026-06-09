import prisma from '../config/db';

export const getUserPointsService = async (userId: string) => {
  const points = await prisma.loyaltyPoint.findMany({
    where: { userId },
  });

  const totalPoints = points.reduce((sum, p) => sum + p.points, 0);

  return { totalPoints };
};

export const getUserPointsHistoryService = async (userId: string) => {
  return await prisma.loyaltyPoint.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
};

export const getActiveRewardsService = async () => {
  return await prisma.pointReward.findMany({
    where: { active: true },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          image: true,
          stock: true,
        },
      },
    },
    orderBy: { pointsCost: 'asc' },
  });
};

export const getAllRewardsService = async () => {
  return await prisma.pointReward.findMany({
    include: {
      product: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
    orderBy: { pointsCost: 'asc' },
  });
};

export const getRewardByIdService = async (id: string) => {
  return await prisma.pointReward.findUnique({
    where: { id },
    include: { product: true },
  });
};

export const validateRewardForCartService = async (userId: string, rewardId: string) => {
  const reward = await prisma.pointReward.findUnique({
    where: { id: rewardId },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          image: true,
          stock: true,
          unlimitedStock: true,
          price: true,
        },
      },
    },
  });

  if (!reward || !reward.active) {
    throw new Error('Recompensa no disponible');
  }

  if (!reward.productId || !reward.product) {
    throw new Error('Esta recompensa no tiene producto asociado');
  }

  const points = await prisma.loyaltyPoint.findMany({
    where: { userId },
    select: { points: true },
  });
  const totalPoints = points.reduce((sum, p) => sum + p.points, 0);

  if (totalPoints < reward.pointsCost) {
    throw new Error('Puntos insuficientes');
  }

  if (reward.product.stock < 1 && !reward.product.unlimitedStock) {
    throw new Error('Producto sin stock');
  }

  return { reward, product: reward.product, pointsCost: reward.pointsCost };
};

export const redeemPointsService = async (userId: string, rewardId: string) => {
  return await prisma.$transaction(async (tx) => {
    const reward = await tx.pointReward.findUnique({
      where: { id: rewardId },
      include: { product: true },
    });

    if (!reward || !reward.active) {
      throw new Error('Recompensa no disponible');
    }

    const points = await tx.loyaltyPoint.findMany({
      where: { userId },
      select: { points: true },
    });
    const totalPoints = points.reduce((sum, p) => sum + p.points, 0);

    if (totalPoints < reward.pointsCost) {
      throw new Error('Puntos insuficientes para canjear esta recompensa');
    }

    if (reward.product && reward.product.stock < 1 && !reward.product.unlimitedStock) {
      throw new Error('Producto sin stock disponible');
    }

    const order = await tx.order.create({
      data: {
        userId,
        total: 0,
        deliveryType: 'PICKUP',
        items: {
          create: {
            quantity: 1,
            price: 0,
            productId: reward.productId || null,
            productName: reward.name,
          },
        },
      },
      include: { items: true },
    });

    await tx.loyaltyPoint.create({
      data: {
        userId,
        points: -reward.pointsCost,
        reason: 'REDEMPTION',
        orderId: order.id,
      },
    });

    if (reward.product && !reward.product.unlimitedStock) {
      await tx.product.update({
        where: { id: reward.product.id },
        data: { stock: { decrement: 1 } },
      });
    }

    return { order, reward };
  });
};

export const awardPointsService = async (userId: string, points: number, reason: string, orderId?: string) => {
  return await prisma.loyaltyPoint.create({
    data: {
      userId,
      points,
      reason: reason || 'BONUS',
      orderId,
    },
  });
};

export const awardPointsForOrderService = async (userId: string, orderTotal: number, orderId: string) => {
  const setting = await prisma.setting.findUnique({
    where: { key: 'pointsPerPeso' },
  });

  const pointsPerPeso = setting ? parseFloat(setting.value) : 0.01;
  const points = Math.floor(orderTotal * pointsPerPeso);

  if (points <= 0) return null;

  return await prisma.loyaltyPoint.create({
    data: {
      userId,
      points,
      reason: 'PURCHASE',
      orderId,
    },
  });
};

export const createRewardService = async (data: {
  name: string;
  description?: string;
  pointsCost: number;
  productId?: string;
  image?: string;
  active?: boolean;
}) => {
  return await prisma.pointReward.create({
    data: {
      name: data.name,
      description: data.description,
      pointsCost: data.pointsCost,
      productId: data.productId || null,
      image: data.image,
      active: data.active ?? true,
    },
  });
};

export const updateRewardService = async (id: string, data: {
  name?: string;
  description?: string;
  pointsCost?: number;
  productId?: string;
  image?: string;
  active?: boolean;
}) => {
  return await prisma.pointReward.update({
    where: { id },
    data,
  });
};

export const deleteRewardService = async (id: string) => {
  return await prisma.pointReward.delete({
    where: { id },
  });
};
