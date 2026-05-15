import prisma from '../config/db';

export const getCategoriesService = async () => {
  return await prisma.category.findMany();
};

export const getCategoryByIdService = async (id: string) => {
  return await prisma.category.findUnique({
    where: { id },
  });
};

export const createCategoryService = async (data: { name: string }) => {
  return await prisma.category.create({
    data,
  });
};

export const updateCategoryService = async (id: string, data: { name: string }) => {
  return await prisma.category.update({
    where: { id },
    data,
  });
};

export const deleteCategoryService = async (id: string) => {
  return await prisma.category.delete({
    where: { id },
  });
};
