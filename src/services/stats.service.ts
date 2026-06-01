import prisma from '../config/db';

export const getAdminStatsService = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const monthAgo = new Date();
  monthAgo.setDate(monthAgo.getDate() - 30);

  const [
    todayOrders,
    weekOrders,
    monthOrders,
    totalUsers,
    pendingOrders,
    confirmedOrders,
    inTransitOrders,
    deliveredOrders,
    totalProducts,
    lowStockProducts,
  ] = await Promise.all([
    prisma.order.findMany({
      where: { createdAt: { gte: today }, status: { not: 'CANCELLED' } },
      select: { total: true },
    }),
    prisma.order.findMany({
      where: { createdAt: { gte: weekAgo }, status: { not: 'CANCELLED' } },
      select: { total: true },
    }),
    prisma.order.findMany({
      where: { createdAt: { gte: monthAgo }, status: { not: 'CANCELLED' } },
      select: { total: true },
    }),
    prisma.user.count({ where: { role: 'USER' } }),
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.order.count({ where: { status: 'CONFIRMED' } }),
    prisma.order.count({ where: { status: 'IN_TRANSIT' } }),
    prisma.order.count({ where: { status: 'DELIVERED' } }),
    prisma.product.count(),
    prisma.product.findMany({
      where: { stock: { lte: 5 }, unlimitedStock: false },
      include: { category: true },
      take: 10,
    }),
  ]);

  const todayRevenue = todayOrders.reduce((sum, o) => sum + o.total, 0);
  const weekRevenue = weekOrders.reduce((sum, o) => sum + o.total, 0);
  const monthRevenue = monthOrders.reduce((sum, o) => sum + o.total, 0);

  const dailySales = [];
  for (let i = 6; i >= 0; i--) {
    const day = new Date();
    day.setDate(day.getDate() - i);
    day.setHours(0, 0, 0, 0);
    const nextDay = new Date(day);
    nextDay.setDate(nextDay.getDate() + 1);

    const orders = await prisma.order.findMany({
      where: {
        createdAt: { gte: day, lt: nextDay },
        status: { not: 'CANCELLED' },
      },
      select: { total: true },
    });

    dailySales.push({
      date: day.toISOString().split('T')[0],
      revenue: orders.reduce((sum, o) => sum + o.total, 0),
      orders: orders.length,
    });
  }

  const topProducts = await prisma.orderItem.groupBy({
    by: ['productId'],
    where: {
      order: { status: { not: 'CANCELLED' }, createdAt: { gte: monthAgo } },
      productId: { not: null },
    },
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: 'desc' } },
    take: 10,
  });

  const topProductIds = topProducts.map(p => p.productId).filter((id): id is string => id !== null);
  const topProductsData = await prisma.product.findMany({
    where: { id: { in: topProductIds } },
    include: { category: true },
  });

  const topProductsResult = topProductsData.map(product => {
    const item = topProducts.find(p => p.productId === product.id);
    return {
      ...product,
      totalSold: item?._sum.quantity || 0,
    };
  }).sort((a, b) => b.totalSold - a.totalSold);

  return {
    revenue: {
      today: todayRevenue,
      week: weekRevenue,
      month: monthRevenue,
    },
    orders: {
      today: todayOrders.length,
      week: weekOrders.length,
      month: monthOrders.length,
      pending: pendingOrders,
      confirmed: confirmedOrders,
      inTransit: inTransitOrders,
      delivered: deliveredOrders,
    },
    users: totalUsers,
    products: {
      total: totalProducts,
      lowStock: lowStockProducts,
    },
    dailySales,
    topProducts: topProductsResult,
  };
};
