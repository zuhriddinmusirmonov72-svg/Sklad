# 🚀 QUICK START GUIDE

## Loyihani ishga tushirish (Development mode)

### 1️⃣ Backend serverni ishga tushirish

**Terminal 1** da:

```bash
cd backend
npm install    # Birinchi marta
npm start
```

✅ Server `http://localhost:3001` da ishga tushadi.

---

### 2️⃣ Frontend serverni ishga tushirish

**Terminal 2** da (yangi terminal oching):

```bash
npm install    # Birinchi marta
npm run dev
```

✅ Frontend `http://localhost:5173` da ochiladi.

---

## 🌐 Browserda ochish

Frontend server ishga tushgach, avtomatik ochiladi yoki qo'lda oching:

```
http://localhost:5173
```

---

## 🔐 Login ma'lumotlari

**Admin kirish**:
- **Email**: `admin@gmail.com`
- **Password**: `admin`

---

## ✅ Loyihaning barcha xususiyatlari

### 1. **Authentication System**
- ✅ Login/Logout
- ✅ Token-based authentication
- ✅ Protected routes
- ✅ Session persistence

### 2. **Products Management**
- ✅ Add new products
- ✅ Edit products
- ✅ Delete products
- ✅ Product weight (gramm) field
- ✅ Stock management
- ✅ Image upload/URL

### 3. **Orders Management**
- ✅ Create new orders
- ✅ Edit orders
- ✅ Order status tracking
- ✅ Customer information
- ✅ Warehouse selection (default: "Склад")

### 4. **Multi-Currency Support**
- ✅ 6 currencies: UZS, USD, EUR, RUB, KZT, CNY
- ✅ Real-time conversion
- ✅ Exchange rates: 1 USD = 12,000 UZS
- ✅ Currency symbols: so'm, $, €, ₽, ₸, ¥

### 5. **Excel Export**
- ✅ Professional formatting
- ✅ Two sheets: "Zakas" and "Batafsil"
- ✅ Company header
- ✅ Detailed statistics
- ✅ Currency-converted prices

### 6. **Image Features**
- ✅ Image zoom on hover (5x size - 250x250px)
- ✅ Works in: products table, order lines, search suggestions

### 7. **User Profile**
- ✅ Editable fields
- ✅ localStorage persistence
- ✅ Default user: "Admin User"

### 8. **Loading Spinner**
- ✅ Shows during data fetch
- ✅ Full-screen overlay with backdrop blur
- ✅ "Yuklanmoqda..." text

### 9. **Backend API**
- ✅ Express.js server
- ✅ JSON file-based database
- ✅ RESTful API endpoints
- ✅ CORS enabled
- ✅ Products CRUD operations
- ✅ Orders CRUD operations
- ✅ Statistics endpoint
- ✅ Health check endpoint

---

## 📡 API Endpoints

### Health Check
```
GET http://localhost:3001/api/health
```

### Products
```
GET    http://localhost:3001/api/products
POST   http://localhost:3001/api/products
PUT    http://localhost:3001/api/products/:id
DELETE http://localhost:3001/api/products/:id
```

### Orders
```
GET    http://localhost:3001/api/orders
POST   http://localhost:3001/api/orders
PUT    http://localhost:3001/api/orders/:id
DELETE http://localhost:3001/api/orders/:id
```

### Statistics
```
GET http://localhost:3001/api/stats
```

---

## 📂 Ma'lumotlar bazasi

Ma'lumotlar saqlanadi:
```
backend/database.json
```

Bu fayl avtomatik yaratiladi va quyidagi strukturaga ega:

```json
{
  "products": [],
  "orders": [],
  "users": []
}
```

---

## 🔄 Yangilanishlar

- ✅ LocalStorage dan Backend API ga o'tkazildi
- ✅ Ma'lumotlar serverda saqlanadi
- ✅ Internet orqali ishlaydi
- ✅ Linklar orqali ulashish mumkin

---

## 🐛 Muammolarni hal qilish

### Backend serverga ulanmayapti

**Xatolik**: "Backend serverga ulanib bo'lmadi!"

**Yechim**:
1. Backend server ishlab turganligini tekshiring
2. Terminal 1 da `npm start` ni qayta bajaring
3. `http://localhost:3001/api/health` ni browserda oching

### Port band

**Xatolik**: "Port 3001 already in use"

**Yechim**:
```bash
# Boshqa port ishlatish
PORT=3002 node server.js
```

va `.env` faylida:
```env
VITE_API_URL=http://localhost:3002
```

---

## 📞 Yordam

1. ✅ Backend terminal ishlab turibdimi?
2. ✅ Frontend terminal ishlab turibdimi?
3. ✅ `npm install` bajarilganmi?
4. ✅ `.env` fayli to'g'rimi?
5. ✅ Port band emasmi?

---

**Muvaffaqiyatli ishlar! 🎉**
