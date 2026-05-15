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

  // 1. Create a default Admin User (if you want to test login quickly)
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@drugstore.com' },
    update: {},
    create: {
      email: 'admin@drugstore.com',
      password: hashedPassword,
      name: 'Admin User',
    },
  });

  // 2. Create Categories
  const categoriesData = [
    { name: 'Bebidas' },
    { name: 'Snacks' },
    { name: 'Alcohol' },
    { name: 'Helados' },
  ];

  for (const cat of categoriesData) {
    await prisma.category.create({
      data: cat,
    });
  }

  const dbCategories = await prisma.category.findMany();

  // 3. Create some dummy products linked to those categories
  if (dbCategories.length > 0) {
    const bebidas = dbCategories.find(c => c.name === 'Bebidas')?.id;
    const snacks = dbCategories.find(c => c.name === 'Snacks')?.id;
    const alcohol = dbCategories.find(c => c.name === 'Alcohol')?.id;

    if (bebidas) {
      await prisma.product.create({
        data: {
          name: 'Coca Cola 2L',
          price: 2500,
          stock: 50,
          categoryId: bebidas,
        }
      });
    }

    if (snacks) {
      await prisma.product.create({
        data: {
          name: 'Papas Lays Clásicas',
          price: 1500,
          stock: 30,
          categoryId: snacks,
        }
      });
    }

    if (alcohol) {
      await prisma.product.create({
        data: {
          name: 'Cerveza Quilmes 1L',
          price: 1800,
          stock: 100,
          categoryId: alcohol,
        }
      });
    }
  }

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
