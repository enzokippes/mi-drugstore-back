import prisma from '../config/db';

export const getPromotionsService = async (activeOnly = false) => {
  const where = activeOnly ? { active: true } : {};
  return await prisma.promotion.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
};

export const getPromotionByIdService = async (id: string) => {
  return await prisma.promotion.findUnique({ where: { id } });
};

export const createPromotionService = async (data: {
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  image?: string;
  active?: boolean;
  startDate?: Date;
  endDate?: Date;
}) => {
  return await prisma.promotion.create({ data });
};

export const updatePromotionService = async (id: string, data: {
  title?: string;
  description?: string;
  price?: number;
  originalPrice?: number;
  image?: string;
  active?: boolean;
  startDate?: Date;
  endDate?: Date;
}) => {
  return await prisma.promotion.update({ where: { id }, data });
};

export const deletePromotionService = async (id: string) => {
  return await prisma.promotion.delete({ where: { id } });
};
