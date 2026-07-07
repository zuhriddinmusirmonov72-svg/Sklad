-- CreateTable
CREATE TABLE "products_uz" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nomi" TEXT NOT NULL,
    "grammm" REAL NOT NULL,
    "qutiIchidaNechta" INTEGER NOT NULL,
    "narxUSD" REAL NOT NULL,
    "narxUZS" REAL NOT NULL,
    "skladMiqdori" INTEGER NOT NULL,
    "rasmUrl" TEXT NOT NULL,
    "tavsif" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
