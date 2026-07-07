-- CreateTable: admin_orders
CREATE TABLE IF NOT EXISTS "admin_orders" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderNumber" TEXT NOT NULL UNIQUE,
    "customer" TEXT NOT NULL,
    "phone" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'Jo''natilmagan',
    "warehouse" TEXT NOT NULL DEFAULT 'Склад',
    "address" TEXT NOT NULL DEFAULT '',
    "comment" TEXT NOT NULL DEFAULT '',
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable: admin_order_lines  
CREATE TABLE IF NOT EXISTS "admin_order_lines" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL DEFAULT '',
    "qty" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    "discount" REAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("orderId") REFERENCES "admin_orders" ("id") ON DELETE CASCADE
);

-- CreateIndex
CREATE INDEX "idx_admin_orders_customer" ON "admin_orders"("customer");
CREATE INDEX "idx_admin_orders_status" ON "admin_orders"("status");
CREATE INDEX "idx_admin_order_lines_orderId" ON "admin_order_lines"("orderId");
