const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('📦 Admin jadvallarini yaratish...');

  // admin_orders jadvali
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS admin_orders (
      id TEXT PRIMARY KEY,
      orderNumber TEXT UNIQUE NOT NULL,
      customer TEXT NOT NULL,
      phone TEXT DEFAULT '',
      status TEXT DEFAULT 'Jo''natilmagan',
      warehouse TEXT DEFAULT 'Склад',
      address TEXT DEFAULT '',
      comment TEXT DEFAULT '',
      currency TEXT DEFAULT 'USD',
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );
  `);

  console.log('✅ admin_orders jadvali yaratildi');

  // admin_order_lines jadvali
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS admin_order_lines (
      id TEXT PRIMARY KEY,
      orderId TEXT NOT NULL,
      productId TEXT NOT NULL,
      name TEXT NOT NULL,
      image TEXT DEFAULT '',
      qty INTEGER NOT NULL,
      price REAL NOT NULL,
      discount REAL DEFAULT 0,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (orderId) REFERENCES admin_orders(id) ON DELETE CASCADE
    );
  `);

  console.log('✅ admin_order_lines jadvali yaratildi');

  // Indexlar
  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS idx_admin_orders_customer ON admin_orders(customer);
  `);
  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS idx_admin_orders_status ON admin_orders(status);
  `);
  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS idx_admin_order_lines_orderId ON admin_order_lines(orderId);
  `);

  console.log('✅ Indexlar yaratildi');
  console.log('\n🎉 Barcha jadvallar muvaffaqiyatli yaratildi!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
