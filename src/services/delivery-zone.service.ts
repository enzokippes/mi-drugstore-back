import prisma from '../config/db';

interface CreateDeliveryZoneInput {
  name: string;
  basePrice: number;
  surcharge?: number;
  maxDistanceKm?: number;
  active?: boolean;
}

interface UpdateDeliveryZoneInput {
  name?: string;
  basePrice?: number;
  surcharge?: number;
  maxDistanceKm?: number;
  active?: boolean;
}

export const getDeliveryZonesService = async (activeOnly = false) => {
  const where = activeOnly ? { active: true } : {};
  return await prisma.deliveryZone.findMany({
    where,
    orderBy: { name: 'asc' },
  });
};

export const getDeliveryZoneByIdService = async (id: string) => {
  return await prisma.deliveryZone.findUnique({
    where: { id },
  });
};

export const createDeliveryZoneService = async (data: CreateDeliveryZoneInput) => {
  return await prisma.deliveryZone.create({
    data: {
      name: data.name,
      basePrice: data.basePrice,
      surcharge: data.surcharge || 0,
      maxDistanceKm: data.maxDistanceKm,
      active: data.active ?? true,
    },
  });
};

export const updateDeliveryZoneService = async (id: string, data: UpdateDeliveryZoneInput) => {
  return await prisma.deliveryZone.update({
    where: { id },
    data,
  });
};

export const deleteDeliveryZoneService = async (id: string) => {
  return await prisma.deliveryZone.delete({
    where: { id },
  });
};

export const calculateDeliveryCostService = async (zoneId: string) => {
  const zone = await prisma.deliveryZone.findUnique({
    where: { id: zoneId },
  });

  if (!zone || !zone.active) {
    return null;
  }

  return {
    zone,
    totalCost: zone.basePrice + zone.surcharge,
  };
};
