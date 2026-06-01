import prisma from '../config/db';

export const getProductsService = async () => {
  return await prisma.product.findMany({
    include: { category: true },
  });
};

export const getProductByIdService = async (id: string) => {
  return await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });
};

export const createProductService = async (data: {
  name: string;
  description?: string;
  price: number;
  stock: number;
  unlimitedStock?: boolean;
  isCombo?: boolean;
  isFeatured?: boolean;
  image?: string;
  categoryId: string;
}) => {
  const { categoryId, ...productData } = data;
  return await prisma.product.create({
    data: {
      ...productData,
      category: { connect: { id: categoryId } },
    },
    include: { category: true },
  });
};

export const updateProductService = async (id: string, data: {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  unlimitedStock?: boolean;
  isCombo?: boolean;
  isFeatured?: boolean;
  image?: string;
  categoryId?: string;
}) => {
  const { categoryId, ...productData } = data;
  const updateData: any = { ...productData };

  if (categoryId) {
    updateData.category = { connect: { id: categoryId } };
  }

  return await prisma.product.update({
    where: { id },
    data: updateData,
    include: { category: true },
  });
};

export const deleteProductService = async (id: string) => {
  return await prisma.product.delete({ where: { id } });
};
