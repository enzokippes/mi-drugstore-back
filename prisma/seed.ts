import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import * as dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || 'file:./dev.db',
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // Admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
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
