# 🎉 ADMIN PANEL API TAYYOR!

## 🌐 Linklar

### 📱 Local (Kompyuter ichida)
- **API URL:** http://localhost:3000/api/v1
- **Swagger:** http://localhost:3000/api/docs

### 🌍 Internet (Ngrok - Barcha dunyo uchun)
- **API URL:** https://lather-shortwave-chief.ngrok-free.dev/api/v1
- **Swagger:** https://lather-shortwave-chief.ngrok-free.dev/api/docs

## 📦 Mavjud API'lar

### 1. **Mahsulotlar (Products)**
```
GET    /api/v1/admin-products          - Barcha mahsulotlar
GET    /api/v1/admin-products/:id      - Bitta mahsulot
POST   /api/v1/admin-products          - Yangi mahsulot
PATCH  /api/v1/admin-products/:id      - Mahsulotni yangilash
DELETE /api/v1/admin-products/:id      - Mahsulotni o'chirish
GET    /api/v1/admin-products/search   - Qidirish
GET    /api/v1/admin-products/stats    - Statistika
```

**Mahsulot strukturasi:**
```json
{
  "name": "Coca Cola",
  "image": "https://example.com/image.jpg",
  "stock": 1000,
  "price": 12,
  "category": "Ichimliklar",
  "weight": 1000,
  "packQuantity": 24
}
```

### 2. **Buyurtmalar (Orders)**
```
GET    /api/v1/admin-orders       - Barcha buyurtmalar
GET    /api/v1/admin-orders/:id   - Bitta buyurtma
POST   /api/v1/admin-orders       - Yangi buyurtma
PATCH  /api/v1/admin-orders/:id   - Buyurtmani yangilash
DELETE /api/v1/admin-orders/:id   - Buyurtmani o'chirish
```

**Buyurtma strukturasi:**
```json
{
  "customer": "Samar",
  "phone": "+998901234567",
  "status": "Jo'natilmagan",
  "warehouse": "Склад",
  "address": "Toshkent",
  "comment": "Tez yetkazib bering",
  "currency": "USD",
  "lines": [
    {
      "productId": "uuid-123",
      "name": "Coca Cola",
      "image": "https://...",
      "qty": 10,
      "price": 12,
      "discount": 0
    }
  ]
}
```

### 3. **Autentifikatsiya (Auth)**
```
POST /api/v1/auth/login    - Kirish
POST /api/v1/auth/register - Ro'yxatdan o'tish
```

### 4. **Fayl Yuklash (Upload)**
```
POST   /api/v1/upload/single       - Bitta fayl yuklash
POST   /api/v1/upload/multiple     - Ko'p fayl yuklash
DELETE /api/v1/upload/:filename    - Faylni o'chirish
```

### 5. **Sog'liqni Tekshirish**
```
GET /api/v1/health - Server holati
GET /               - Xush kelibsiz sahifasi
```

## 🔥 Muhim Ma'lumotlar

### ✅ O'zgarishlar:
1. ✅ Admin panel database.json strukturasiga mos API yaratildi
2. ✅ Mahsulotlar va Buyurtmalar to'liq CRUD operatsiyalari
3. ✅ Swagger o'zbekcha tilga o'tkazildi
4. ✅ Eski API'lar o'chirildi (Users, Categories, Customers, Dashboard, Search modullar)
5. ✅ Faqat kerakli API'lar qoldirildi
6. ✅ Database SQLite (cheksiz saqlash, 10+ yil)
7. ✅ Ngrok bilan internet orqali kirish

### 📊 Database:
- **Fayl:** `d:\beckend\prisma\dev.db`
- **Tip:** SQLite (cheksiz saqlash)
- **Ma'lumotlar:** 10+ yil saqlanadi, kompyuter o'chsa ham yo'qolmaydi

### 🎯 Swagger Sozlamalari:
- **Sarlavha:** "Admin Panel API - O'zbekcha"
- **Versiya:** 2.0.0
- **Taglar:**
  - Autentifikatsiya
  - Mahsulotlar (Admin Panel)
  - Buyurtmalar (Admin Panel)
  - Yuklash
  - Sog'liqni Tekshirish

## 🚀 Qanday Ishlatish

### 1. Local da test qilish:
```bash
curl http://localhost:3000/api/v1/admin-products
```

### 2. Internet orqali test qilish:
```bash
curl https://lather-shortwave-chief.ngrok-free.dev/api/v1/admin-products
```

### 3. Swagger da test qilish:
1. Brauzerda oching: https://lather-shortwave-chief.ngrok-free.dev/api/docs
2. "Try it out" tugmasini bosing
3. Ma'lumotlarni kiriting
4. "Execute" tugmasini bosing

## 🛠️ Server Boshqarish

### Serverni to'xtatish:
```bash
# Terminal 2 da (Backend)
Ctrl + C

# Terminal 3 da (Ngrok)
Ctrl + C
```

### Serverni qayta ishga tushirish:
```bash
# d:\beckend papkasida
npm run start:dev

# Boshqa terminalda
.\ngrok.exe http --url=lather-shortwave-chief.ngrok-free.dev 3000
```

## 📝 Qo'shimcha

- **Admin panel fayllar:** `d:\beckend\Admin\` (eski, ishlatilmayapti)
- **Yangi backend:** `d:\beckend\src\modules\admin-*\` (ishlatilmoqda)
- **Database:** `d:\beckend\prisma\dev.db` (SQLite, cheksiz saqlash)

---

✅ **HAMMA NARSA TAYYOR VA ISHLAYAPTI!**
