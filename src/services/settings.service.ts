import prisma from '../config/db';

export const getSetting = async (key: string): Promise<string | null> => {
  const setting = await prisma.setting.findUnique({ where: { key } });
  return setting?.value ?? null;
};

export const setSetting = async (key: string, value: string): Promise<void> => {
  await prisma.setting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
};

export const getAllSettings = async (): Promise<Record<string, string>> => {
  const settings = await prisma.setting.findMany();
  return settings.reduce((acc, s) => {
    acc[s.key] = s.value;
    return acc;
  }, {} as Record<string, string>);
};

const PUBLIC_SETTINGS_KEYS = ['trackInventory', 'storeHours', 'deliveryHours'];

export const getPublicSettings = async (): Promise<Record<string, string>> => {
  const settings = await prisma.setting.findMany({
    where: { key: { in: PUBLIC_SETTINGS_KEYS } },
  });
  return settings.reduce((acc, s) => {
    acc[s.key] = s.value;
    return acc;
  }, {} as Record<string, string>);
};
