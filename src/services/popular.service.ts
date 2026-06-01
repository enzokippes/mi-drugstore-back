import prisma from '../config/db';

export const getPopularProductsService = async (limit = 10, days = 30) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const popularItems = await prisma.orderItem.groupBy({
    by: ['productId'],
    where: {
      order: {
        status: { not: 'CANCELLED' },
        createdAt: { gte: startDate },
      },
      productId: { not: null },
    },
    _sum: {
      quantity: true,
    },
    orderBy: {
      _sum: {
        quantity: 'desc',
      },
    },
    take: limit,
  });

  const productIds = popularItems
    .map(item => item.productId)
    .filter((id): id is string => id !== null);

  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    include: { category: true },
  });

  return products.map(product => {
    const item = popularItems.find(i => i.productId === product.id);
    return {
      ...product,
      totalSold: item?._sum.quantity || 0,
    };
  });
};

export const getFeaturedProductsService = async () => {
  return await prisma.product.findMany({
    where: { isFeatured: true },
    include: { category: true },
  });
};

export const getPopularSuggestionsService = async (limit = 10, days = 30) => {
  const popular = await getPopularProductsService(limit * 2, days);
  return popular.filter(p => !p.isFeatured).slice(0, limit);
};
