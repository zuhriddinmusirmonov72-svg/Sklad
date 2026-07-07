# 🚀 Admin Dashboard - Backend Integration

Bu loyiha uchun backend server va uning o'rnatish yo'riqnomasi.

---

## 📋 Tizim talablari

- **Node.js** v16 yoki undan yuqori
- **npm** yoki **yarn** paket menejeri

---

## 🔧 Backend serverni o'rnatish

### 1. Backend paketlarni o'rnatish

Terminalda loyihaning `backend` papkasiga o'ting va paketlarni o'rnating:

```bash
cd backend
npm install
```

### 2. Backend serverni ishga tushirish

```bash
npm start
```

yoki

```bash
node server.js
```

✅ **Server muvaffaqiyatli ishga tushsa**, siz quyidagi chiroyli banerni ko'rasiz:

```
╔═══════════════════════════════════════════╗
║  🚀 Backend Server ishga tushdi!         ║
║                                           ║
║  📍 URL: http://localhost:3001           ║
║  📊 Database: backend/database.json      ║
║                                           ║
║  API Endpoints:                           ║
║  • GET    /api/products                   ║
║  • POST   /api/products                   ║
║  • PUT    /api/products/:id               ║
║  • DELETE /api/products/:id               ║
║                                           ║
║  • GET    /api/orders                     ║
║  • POST   /api/orders                     ║
║  • PUT    /api/orders/:id                 ║
║  • DELETE /api/orders/:id                 ║
║                                           ║
║  • GET    /api/stats                      ║
║  • GET    /api/health                     ║
╚═══════════════════════════════════════════╝
```

---

## 🌐 Frontend bilan bog'lash

### 1. Frontend paketlarni o'rnatish

Loyihaning asosiy papkasida (root):

```bash
npm install
```

### 2. Frontend serverni ishga tushirish

**Yangi terminal oching** (backend server ishlab turganida) va loyihaning asosiy papkasida:

```bash
npm run dev
```

✅ Frontend `http://localhost:5173` da ochiladi.

---

## 🔄 Ikkala serverni birga ishga tushirish

Agar siz ikkala serverni bir vaqtda ishga tushirmoqchi bo'lsangiz:

### Windows (PowerShell yoki CMD):

**1-terminal** (Backend):
```bash
cd backend
npm start
```

**2-terminal** (Frontend):
```bash
npm run dev
```

### Linux/Mac:

**1-terminal** (Backend):
```bash
cd backend && npm start
```

**2-terminal** (Frontend):
```bash
npm run dev
```

---

## 💾 Ma'lumotlar bazasi

Backend server faylga asoslangan baza ishlatadi:

- **Fayl manzili**: `backend/database.json`
- **Tuzilish**:
  ```json
  {
    "products": [],
    "orders": [],
    "users": []
  }
  ```

⚠️ **MUHIM**: 
- Bu fayl avtomatik yaratiladi
- Ma'lumotlar bu faylda saqlanadi
- Serverdan ma'lumotlar linklar orqali ulashish mumkin

---

## 🌍 Onlayn qilish (Internet orqali kirish)

Loyihani internetda joylashtirish uchun quyidagi bepul platformalardan foydalaning:

### ✅ 1. Render.com (TAVSIYA QILAMIZ - 100% BEPUL)

1. **Ro'yxatdan o'ting**: [render.com](https://render.com)
2. **GitHub** orqali login qiling
3. "**New**" → "**Web Service**" tugmasini bosing
4. GitHub repoingizni tanlang
5. Sozlamalar:
   - **Name**: `admin-backend` (istalgan nom)
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && node server.js`
   - **Port**: `3001`
6. "**Create Web Service**" bosing

✅ 5-10 daqiqada deploy bo'ladi va sizga **HTTPS URL** beriladi:
```
https://admin-backend-xxxx.onrender.com
```

**Frontend .env faylini yangilang**:
```env
VITE_API_URL=https://admin-backend-xxxx.onrender.com
```

---

### 2. Railway.app

1. [railway.app](https://railway.app) ga kiring
2. GitHub repoingizni ulang
3. Backend papkani tanlang
4. Deploy qiling
5. URL olasiz: `https://your-app.up.railway.app`

---

### 3. Cyclic.sh

1. [cyclic.sh](https://cyclic.sh) ga ro'yxatdan o'ting
2. GitHub reponi ulang
3. Backend papkani tanlang
4. Deploy tugmasini bosing
5. URL olasiz: `https://your-app.cyclic.app`

---

## 🧪 API ni test qilish

Backend serverning ishlayotganini tekshirish uchun:

### Browser orqali:

```
http://localhost:3001/api/health
```

✅ Natija:
```json
{
  "success": true,
  "message": "Server ishlamoqda!",
  "timestamp": "2026-07-03T..."
}
```

### Mahsulotlar ro'yxati:

```
http://localhost:3001/api/products
```

---

## 🔐 API Endpoints

### 📦 Mahsulotlar

| Method | Endpoint | Tavsif |
|--------|----------|--------|
| `GET` | `/api/products` | Barcha mahsulotlar |
| `POST` | `/api/products` | Yangi mahsulot qo'shish |
| `PUT` | `/api/products/:id` | Mahsulotni yangilash |
| `DELETE` | `/api/products/:id` | Mahsulotni o'chirish |

**Misol - Yangi mahsulot qo'shish**:
```json
POST /api/products
{
  "name": "iPhone 15",
  "price": 12000000,
  "stock": 10,
  "image": "https://...",
  "category": "Telefon",
  "weight": 200
}
```

### 📋 Buyurtmalar

| Method | Endpoint | Tavsif |
|--------|----------|--------|
| `GET` | `/api/orders` | Barcha buyurtmalar |
| `POST` | `/api/orders` | Yangi buyurtma qo'shish |
| `PUT` | `/api/orders/:id` | Buyurtmani yangilash |
| `DELETE` | `/api/orders/:id` | Buyurtmani o'chirish |

### 📊 Statistika

| Method | Endpoint | Tavsif |
|--------|----------|--------|
| `GET` | `/api/stats` | Umumiy statistika |
| `GET` | `/api/health` | Server holati |

---

## ⚠️ Tez-tez uchraydigan muammolar

### ❌ Port band

**Xatolik**: `Error: listen EADDRINUSE: address already in use :::3001`

**Yechim**: 3001 port band. Boshqa port ishlatish:
```bash
PORT=3002 node server.js
```

### ❌ Backend serverga ulanib bo'lmayapti

**Sabab**: Backend server ishlamayapti

**Yechim**: 
1. Backend terminal ishlab turganligini tekshiring
2. `http://localhost:3001/api/health` ochib tekshiring

### ❌ Ma'lumotlar saqlanmayapti

**Sabab**: Backend server to'xtatilgan

**Yechim**: Backend serverni qayta ishga tushiring va browserni refresh qiling

---

## 📱 Linklar orqali ulashish

Backend online bo'lgandan keyin (masalan, Render.com da):

1. **Link olish**:
   ```
   https://admin-backend-xxxx.onrender.com
   ```

2. **Do'stingizga yuborish**:
   ```
   Mening admin dashboardim: https://admin-frontend.vercel.app
   ```

3. **Mahsulotlar va buyurtmalar** avtomatik ravishda backend serverda saqlanadi
4. **Har kim o'z qurilmasidan** kirishi mumkin

---

## 🎯 Xususiyatlar

✅ Ma'lumotlar backendda saqlanadi  
✅ Real-time yangilanishlar  
✅ Internet orqali ishlaydi  
✅ Linklar orqali ulashish mumkin  
✅ Mahsulotlar, buyurtmalar, statistika  
✅ Multi-currency support (UZS, USD, EUR, RUB, KZT, CNY)  
✅ Excel export  
✅ Image zoom on hover  
✅ Authentication system  

---

## 📞 Yordam

Agar savol yoki muammo bo'lsa, quyidagilarni tekshiring:

1. ✅ Node.js o'rnatilgan: `node --version`
2. ✅ Backend server ishlab turibdi
3. ✅ Frontend server ishlab turibdi
4. ✅ `.env` faylida to'g'ri URL
5. ✅ Port band emasligini tekshiring

---

**Muvaffaqiyatli ishlar tilaymiz! 🚀**
