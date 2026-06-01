import prisma from '../config/db';

export const getCategoriesService = async () => {
  return await prisma.category.findMany({
    include: { children: true },
    orderBy: { name: 'asc' },
  });
};

export const getCategoryByIdService = async (id: string) => {
  return await prisma.category.findUnique({
    where: { id },
    include: { children: true, parent: true },
  });
};

export const createCategoryService = async (data: { name: string; parentId?: string | null }) => {
  return await prisma.category.create({
    data: {
      name: data.name,
      parentId: data.parentId || null,
    },
    include: { children: true },
  });
};

export const updateCategoryService = async (id: string, data: { name?: string; parentId?: string | null }) => {
  return await prisma.category.update({
    where: { id },
    data,
    include: { children: true },
  });
};

export const deleteCategoryService = async (id: string) => {
  return await prisma.category.delete({
    where: { id },
  });
};
