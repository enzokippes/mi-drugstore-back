import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import prisma from '../src/config/db';

dotenv.config();

async function main() {
  console.log('Seeding database...');

  // Admin user
  const hashedPassword = await bcrypt.hash('Admin123!Drugstore@BarbaN3GRA', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@barbanegra.com' },
    update: {},
    create: {
      email: 'admin@barbanegra.com',
      password: hashedPassword,
      name: 'Admin Barba Negra',
      role: 'ADMIN',
    },
  });
  console.log(`  ✅ Admin: ${admin.email} (role: ${admin.role})`);

  // Settings
  await prisma.setting.upsert({
    where: { key: 'trackInventory' },
    update: {},
    create: { key: 'trackInventory', value: 'true' },
  });
  console.log('  ✅ Settings created');

  // Categories
  const categoriesData = [
    { name: 'Bebidas' },
    { name: 'Snacks' },
    { name: 'Alcohol' },
    { name: 'Helados' },
    { name: 'Hielo' },
  ];

  for (const cat of categoriesData) {
    await prisma.category.create({ data: cat });
  }
  console.log('  ✅ Categories created');

  const dbCategories = await prisma.category.findMany();

  const bebidas = dbCategories.find(c => c.name === 'Bebidas')?.id;
  const snacks = dbCategories.find(c => c.name === 'Snacks')?.id;
  const alcohol = dbCategories.find(c => c.name === 'Alcohol')?.id;
  const hielo = dbCategories.find(c => c.name === 'Hielo')?.id;

  if (bebidas) {
    await prisma.product.create({
      data: { name: 'Coca Cola 2L', price: 2500, stock: 50, categoryId: bebidas },
    });
    await prisma.product.create({
      data: { name: 'Combo Fernet + Coca', price: 6000, stock: 20, categoryId: bebidas, isCombo: true },
    });
  }
  if (snacks) {
    await prisma.product.create({
      data: { name: 'Papas Lays Clásicas', price: 1500, stock: 30, categoryId: snacks },
    });
    await prisma.product.create({
      data: { name: 'Combo Picada XL', price: 4500, stock: 15, categoryId: snacks, isCombo: true },
    });
  }
  if (alcohol) {
    await prisma.product.create({
      data: { name: 'Cerveza Quilmes 1L', price: 1800, stock: 100, categoryId: alcohol },
    });
  }
  if (hielo) {
    await prisma.product.create({
      data: { name: 'Bolsa de Hielo 2.5kg', price: 800, stock: 0, unlimitedStock: true, categoryId: hielo },
    });
  }
  console.log('  ✅ Products created');

  // Delivery Zones (ordered by distance from store: closest to farthest)
  // Centro > San Carlos/Costanera > La Bianca > Villa Zorraquin
  await prisma.deliveryZone.deleteMany({});
  const zonesData = [
    { name: 'Centro', basePrice: 1500, surcharge: 0, maxDistanceKm: 3 },
    { name: 'San Carlos', basePrice: 2000, surcharge: 500, maxDistanceKm: 6 },
    { name: 'Costanera', basePrice: 2000, surcharge: 500, maxDistanceKm: 6 },
    { name: 'La Bianca', basePrice: 2500, surcharge: 1000, maxDistanceKm: 8 },
    { name: 'Villa Zorraquin', basePrice: 3000, surcharge: 1500, maxDistanceKm: 10 },
  ];

  for (const zone of zonesData) {
    await prisma.deliveryZone.create({ data: zone });
  }
  console.log('  ✅ Delivery zones created');

  // Settings for loyalty points
  await prisma.setting.upsert({
    where: { key: 'pointsPerPeso' },
    update: {},
    create: { key: 'pointsPerPeso', value: '0.01' },
  });

  // Settings for store and delivery hours
  await prisma.setting.upsert({
    where: { key: 'storeHours' },
    update: {},
    create: {
      key: 'storeHours',
      value: JSON.stringify({
        weekdays: { open: '07:00', close: '01:00' },
        sunday: { open: '07:00', close: '01:00' },
      }),
    },
  });

  await prisma.setting.upsert({
    where: { key: 'deliveryHours' },
    update: {},
    create: {
      key: 'deliveryHours',
      value: JSON.stringify({
        weekdays: { open: '18:00', close: '01:00' },
        sunday: { open: '18:00', close: '23:00' },
      }),
    },
  });

  console.log('  ✅ Loyalty and schedule settings created');

  // Point Rewards
  const dbBebidas = await prisma.category.findFirst({ where: { name: 'Bebidas' } });
  const cocaProduct = dbBebidas ? await prisma.product.findFirst({ where: { name: 'Coca Cola 2L' } }) : null;

  const rewardsData = [
    {
      name: 'Coca Cola 500ml',
      description: 'Una Coca Cola bien fria de 500ml',
      pointsCost: 50,
      productId: cocaProduct?.id || null,
    },
    {
      name: 'Descuento $500',
      description: 'Descuento de $500 en tu proximo pedido',
      pointsCost: 100,
    },
    {
      name: 'Bolsa de Hielo Gratis',
      description: 'Una bolsa de hielo 2.5kg gratis con tu pedido',
      pointsCost: 30,
    },
  ];

  for (const reward of rewardsData) {
    await prisma.pointReward.create({ data: reward });
  }
  console.log('  ✅ Point rewards created');

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
