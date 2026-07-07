# Netlify Deploy Muammosini Hal Qilish

## Muammo
Netlify'da deploy qilgandan keyin frontend `localhost:3001` ga ulanishga harakat qilardi va bu xato berdi:
```
Backend bilan bog'lanishda xatolik: TypeError: Failed to fetch
```

## Yechim
Environment variables orqali API URL'ni boshqariladigan qilib qildik.

---

## O'zgartirilgan Fayllar

### 1. `src/pages/CustomerPortal.tsx`
```typescript
// OLDIN:
const API_URL = 'http://localhost:3001';

// KEYIN:
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
```

### 2. `src/pages/Orders/OrdersContext.tsx`
```typescript
// Allaqachon to'g'ri edi:
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
```

### 3. Yangi Fayllar Yaratildi

**`.env.development`** - Lokal ishlab chiqish uchun:
```
VITE_API_URL=http://localhost:3001
```

**`.env.production`** - Production deploy uchun (placeholder):
```
VITE_API_URL=https://your-backend-url.onrender.com
```

### 4. `.gitignore` Yangilandi
`.env.development` va `.env.production` ni commit qilish mumkin (chunki secret yo'q).

---

## Keyingi Qadamlar

### 1️⃣ Backend'ni Render.com'da Deploy Qilish

Backend allaqachon GitHub'da:
```
https://github.com/zuhriddinmusirmonov72-svg/admin-backend
```

**Render.com'da:**
1. New Web Service yarating
2. GitHub repository'ni ulang
3. Sozlamalar:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Runtime: Node
4. Deploy qiling
5. URL olib qo'ying: `https://admin-backend-xxxx.onrender.com`

### 2️⃣ Netlify'da Environment Variable Qo'shish

1. Netlify Dashboard → Site configuration → Environment variables
2. Yangi variable qo'shing:
   ```
   Key: VITE_API_URL
   Value: https://admin-backend-xxxx.onrender.com
   ```
   (Render.com'dan olgan haqiqiy URL'ni yozing)

### 3️⃣ Netlify'da Redeploy

1. **Deploys** → **Trigger deploy** → **Deploy site**
2. Deploy tugagach saytingiz ishlashi kerak!

### 4️⃣ Test Qilish

**Backend:**
```bash
curl https://admin-backend-xxxx.onrender.com/api/health
```

Javob:
```json
{
  "success": true,
  "message": "Server ishlamoqda!"
}
```

**Frontend:**
1. `https://your-app.netlify.app` ga kiring
2. Admin login: `admin@gmail.com` / `admin`
3. Mahsulot qo'shing
4. Customer portal (/shop) ga kiring
5. Zakas bering - muvaffaqiyatli bo'lishi kerak!

---

## To'liq Deploy Qo'llanmasi

Batafsil qo'llanma: `DEPLOYMENT_INSTRUCTIONS.md`

---

## Hozirgi Holat

✅ Frontend build muvaffaqiyatli (TypeScript xatolari hal qilindi)
✅ Environment variables sozlandi
✅ Backend GitHub'da tayyor
⏳ Backend'ni Render.com'da deploy qilish kerak
⏳ Netlify'da VITE_API_URL o'rnatish kerak

---

## Lokal Testlash

Development muhitida (lokal):
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
npm run dev
```

Frontend avtomatik `http://localhost:3001` ga ulanadi (`.env.development` dan).

---

**Muallif:** Kiro AI  
**Sana:** 2026-07-05  
**Build Status:** ✅ Muvaffaqiyatli
