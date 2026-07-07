# Backend va Frontend Deploy Qilish Bo'yicha To'liq Qo'llanma

## Muammo
Netlify'da frontend deploy qilinganda `localhost:3001` ga ulanishga harakat qiladi, lekin bu ishlamaydi. Backend ham deploy qilish kerak.

---

## 1. BACKEND'NI RENDER.COM'DA DEPLOY QILISH

### 1.1. GitHub'ga Backend Push Qilish

Backend allaqachon GitHub'da: https://github.com/zuhriddinmusirmonov72-svg/admin-backend

### 1.2. Render.com'da Akkaunt Ochish

1. https://render.com ga kiring
2. **Sign Up** yoki **Log In** qiling (GitHub bilan kirish tavsiya etiladi)

### 1.3. Yangi Web Service Yaratish

1. Dashboard'da **New +** tugmasini bosing
2. **Web Service** ni tanlang
3. GitHub repository'ni ulang:
   - Repository: `admin-backend`
   - Branch: `main`

### 1.4. Service Sozlamalari

**Basic Settings:**
```
Name: admin-backend
Region: Frankfurt (EU Central) yoki Singapore (yaqinroq server)
Branch: main
Root Directory: (bo'sh qoldiring)
Runtime: Node
Build Command: npm install
Start Command: npm start
```

**Advanced Settings:**
```
Plan: Free
Auto-Deploy: Yes
```

### 1.5. Environment Variables

Hozircha kerak emas (chunki database.json file-based).

### 1.6. Deploy

1. **Create Web Service** tugmasini bosing
2. 3-5 daqiqa kuting (birinchi deploy)
3. Deploy tugagach URL olib qo'ying:
   ```
   https://admin-backend-xxxx.onrender.com
   ```

### 1.7. Test Qilish

Browser'da ochib ko'ring:
```
https://admin-backend-xxxx.onrender.com/api/health
```

Javob:
```json
{
  "success": true,
  "message": "Server ishlamoqda!",
  "timestamp": "2026-07-05T..."
}
```

---

## 2. FRONTEND'NI NETLIFY'DA DEPLOY QILISH

### 2.1. Lokal Build Qilish (Test)

```bash
npm run build
```

Muvaffaqiyatli bo'lishi kerak (biz TypeScript xatolarini hal qildik).

### 2.2. Netlify'da Environment Variable Qo'shish

1. Netlify Dashboard'da loyihangizni oching
2. **Site configuration** → **Environment variables**
3. **Add a variable** tugmasini bosing

**Qo'shish kerak bo'lgan variable:**
```
Key: VITE_API_URL
Value: https://admin-backend-xxxx.onrender.com
```

⚠️ **MUHIM:** `https://admin-backend-xxxx.onrender.com` ni Render.com'dan olgan haqiqiy URL bilan almashtiring!

### 2.3. Netlify'da Redeploy

1. **Deploys** tabiga o'ting
2. **Trigger deploy** → **Deploy site** ni bosing
3. Yoki GitHub'ga push qilsangiz avtomatik deploy bo'ladi

### 2.4. Test Qilish

1. Netlify'dan olgan URL'ni oching (masalan: `https://your-app.netlify.app`)
2. Login qiling:
   - **Admin:** email: `admin@gmail.com`, password: `admin`
   - **Customer:** ixtiyoriy email/password
3. Admin panel'da mahsulot qo'shing
4. Customer portal'da (/shop) mahsulotlar ko'rinishi kerak
5. Customer portal'da zakas bering - muvaffaqiyatli bo'lishi kerak

---

## 3. MUAMMOLARNI BARTARAF ETISH

### Muammo 1: Backend'dan ma'lumotlar yuklanmayapdi

**Sabab:** VITE_API_URL noto'g'ri yoki backend ishlamayapdi

**Yechim:**
1. Browser Console'da (F12) xatoni ko'ring
2. Network tab'da API so'rovlarni tekshiring
3. Render.com'da backend Logs'ni ko'ring
4. Backend URL to'g'ri ekanligini tekshiring

### Muammo 2: CORS xatosi

**Sabab:** Backend CORS sozlanmagan

**Yechim:** Backend `server.js` da CORS allaqachon sozlangan:
```javascript
app.use(cors({
  origin: '*',  // Hamma domenlardan ruxsat
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));
```

### Muammo 3: 404 Not Found (API endpoints)

**Sabab:** Backend to'g'ri deploy qilinmagan

**Yechim:**
1. Render.com'da **Logs** ni tekshiring
2. **Build Command** va **Start Command** to'g'ri ekanligini tekshiring
3. `package.json` da `"start": "node server.js"` borligini tekshiring

### Muammo 4: Database ma'lumotlari yo'qolmoqda

**Sabab:** Render.com Free plan'da filesystem read-only (faqat read)

**Yechim 1 (Tezkor):** Har safar yangi mahsulot qo'shganingizda:
1. Render.com'da **Shell** ni oching
2. `database.json` ni yuklab oling
3. GitHub'ga commit qiling

**Yechim 2 (Uzoq muddatli):** PostgreSQL yoki MongoDB ishlatish (keyinroq)

### Muammo 5: Render Free Plan Limitations

Render.com Free plan:
- ✅ 750 soat/oy (yetarli)
- ❌ 15 daqiqa ishlamaslik keyin sleep mode (birinchi so'rov sekinroq)
- ❌ Filesystem read-only (database.json o'zgarishlar saqlanmasligi mumkin)

**Yechim:** 
- Muhim loyiha uchun Paid plan ($7/oy)
- Yoki Railway.app, Fly.io, DigitalOcean kabi alternativalar

---

## 4. QISQACHA CHEAT SHEET

### Backend Deploy (Render.com)
1. GitHub: https://github.com/zuhriddinmusirmonov72-svg/admin-backend
2. Render.com → New Web Service
3. Build: `npm install`, Start: `npm start`
4. URL oling: `https://admin-backend-xxxx.onrender.com`

### Frontend Deploy (Netlify)
1. Environment Variable qo'shing:
   ```
   VITE_API_URL=https://admin-backend-xxxx.onrender.com
   ```
2. Redeploy qiling
3. Test qiling: Login, Mahsulot qo'shish, Zakas berish

### Test URLs
```bash
# Backend health check
curl https://admin-backend-xxxx.onrender.com/api/health

# Backend products
curl https://admin-backend-xxxx.onrender.com/api/products

# Frontend
https://your-app.netlify.app
```

---

## 5. KEYINGI QADAMLAR (Optional)

### 5.1. Custom Domain
Netlify va Render.com'da custom domain qo'shish mumkin:
- Frontend: `www.yourcompany.uz`
- Backend: `api.yourcompany.uz`

### 5.2. Database Migration
File-based database o'rniga real database:
- **PostgreSQL** (Render.com'da bepul plan bor)
- **MongoDB Atlas** (bepul 512MB)
- **Supabase** (PostgreSQL + bepul plan)

### 5.3. Authentication
Hozirgi auth juda oddiy. Yaxshilash:
- JWT tokens
- Refresh tokens
- Password hashing (bcrypt)
- Email verification

---

## Yordam Kerak Bo'lsa

Agar deploy jarayonida muammo bo'lsa:
1. Browser Console (F12) → Console tab
2. Browser Console → Network tab
3. Render.com → Logs
4. Netlify → Deploys → Deploy log

Xatolarni screenshot qilib yuboring!

---

**Deploy qilishda omad! 🚀**
