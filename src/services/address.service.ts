import prisma from '../config/db';

interface CreateAddressInput {
  userId: string;
  label: string;
  street: string;
  number: string;
  notes?: string;
  zoneId?: string;
  isDefault?: boolean;
}

interface UpdateAddressInput {
  label?: string;
  street?: string;
  number?: string;
  notes?: string;
  zoneId?: string;
  isDefault?: boolean;
}

export const getUserAddressesService = async (userId: string) => {
  return await prisma.address.findMany({
    where: { userId },
    include: { zone: true },
    orderBy: { isDefault: 'desc' },
  });
};

export const getAddressByIdService = async (id: string, userId: string) => {
  return await prisma.address.findFirst({
    where: { id, userId },
    include: { zone: true },
  });
};

export const createAddressService = async (data: CreateAddressInput) => {
  if (data.isDefault) {
    await prisma.address.updateMany({
      where: { userId: data.userId, isDefault: true },
      data: { isDefault: false },
    });
  }

  const existingCount = await prisma.address.count({ where: { userId: data.userId } });
  const isDefault = data.isDefault ?? existingCount === 0;

  return await prisma.address.create({
    data: {
      userId: data.userId,
      label: data.label,
      street: data.street,
      number: data.number,
      notes: data.notes,
      zoneId: data.zoneId || null,
      isDefault,
    },
    include: { zone: true },
  });
};

export const updateAddressService = async (id: string, userId: string, data: UpdateAddressInput) => {
  const address = await prisma.address.findFirst({ where: { id, userId } });
  if (!address) throw new Error('Direccion no encontrada');

  if (data.isDefault) {
    await prisma.address.updateMany({
      where: { userId, isDefault: true, id: { not: id } },
      data: { isDefault: false },
    });
  }

  return await prisma.address.update({
    where: { id },
    data,
    include: { zone: true },
  });
};

export const deleteAddressService = async (id: string, userId: string) => {
  const address = await prisma.address.findFirst({ where: { id, userId } });
  if (!address) throw new Error('Direccion no encontrada');

  await prisma.address.delete({ where: { id } });

  if (address.isDefault) {
    const first = await prisma.address.findFirst({ where: { userId } });
    if (first) {
      await prisma.address.update({ where: { id: first.id }, data: { isDefault: true } });
    }
  }
};
