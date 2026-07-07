# 🌍 DEPLOYMENT GUIDE - Loyihani internetga chiqarish

Bu yo'riqnoma loyihangizni internetga chiqarish va linklar orqali ulashish uchun.

---

## 📋 Kerakli narsalar

- ✅ GitHub akkaunt
- ✅ Loyiha GitHub repoda bo'lishi
- ✅ Backend va Frontend kodi

---

## 🚀 USUL 1: Render.com (TAVSIYA - 100% BEPUL)

### Backend ni Render.com ga deploy qilish

#### 1. GitHub repo yarating

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/admin-dashboard.git
git push -u origin main
```

#### 2. Render.com ga kiring

1. [render.com](https://render.com) ga o'ting
2. **GitHub** orqali login qiling
3. **New** → **Web Service** tugmasini bosing

#### 3. Repository ni tanlang

1. GitHub repolaringiz ko'rinadi
2. Loyihangizni tanlang
3. **Connect** tugmasini bosing

#### 4. Sozlamalar

**Name**: `admin-backend` (yoki istalgan nom)

**Environment**: `Node`

**Build Command**:
```bash
cd backend && npm install
```

**Start Command**:
```bash
cd backend && node server.js
```

**Environment Variables** (agar kerak bo'lsa):
```
PORT=3001
NODE_ENV=production
```

#### 5. Deploy qiling

**Create Web Service** tugmasini bosing.

⏳ 5-10 daqiqa kutib turing...

✅ **Deploy tugadi!** Sizga URL beriladi:
```
https://admin-backend-xxxx.onrender.com
```

#### 6. Test qiling

Browserda oching:
```
https://admin-backend-xxxx.onrender.com/api/health
```

Natija:
```json
{
  "success": true,
  "message": "Server ishlamoqda!",
  "timestamp": "2026-07-03T..."
}
```

---

### Frontend ni Vercel ga deploy qilish

#### 1. Vercel ga kiring

1. [vercel.com](https://vercel.com) ga o'ting
2. **GitHub** orqali login qiling
3. **New Project** tugmasini bosing

#### 2. Repository ni import qiling

1. GitHub repongizni tanlang
2. **Import** tugmasini bosing

#### 3. Sozlamalar

**Project Name**: `admin-dashboard`

**Framework Preset**: `Vite`

**Environment Variables**:
```
VITE_API_URL=https://admin-backend-xxxx.onrender.com
```

⚠️ **MUHIM**: `xxxx` ni o'zingizning Render backend URL bilan almashtiring!

#### 4. Deploy qiling

**Deploy** tugmasini bosing.

⏳ 2-3 daqiqa kutib turing...

✅ **Deploy tugadi!** Sizga URL beriladi:
```
https://admin-dashboard-xxxx.vercel.app
```

---

## 🚀 USUL 2: Railway.app

### Backend ni Railway ga deploy qilish

#### 1. Railway ga kiring

1. [railway.app](https://railway.app) ga o'ting
2. **GitHub** orqali login qiling

#### 2. New Project

1. **New Project** tugmasini bosing
2. **Deploy from GitHub repo** ni tanlang
3. Repongizni tanlang

#### 3. Sozlamalar

**Root Directory**: `/backend`

**Build Command**:
```bash
npm install
```

**Start Command**:
```bash
node server.js
```

**Environment Variables**:
```
PORT=3001
```

#### 4. Deploy

Avtomatik deploy boshlanadi.

✅ URL olasiz:
```
https://your-app.up.railway.app
```

---

## 🚀 USUL 3: Cyclic.sh

### Backend ni Cyclic ga deploy qilish

#### 1. Cyclic ga kiring

1. [cyclic.sh](https://cyclic.sh) ga o'ting
2. **GitHub** orqali login qiling

#### 2. Link Your Repo

1. **Link Your Repo** tugmasini bosing
2. Repongizni tanlang

#### 3. Deploy

Avtomatik deploy boshlanadi.

✅ URL olasiz:
```
https://your-app.cyclic.app
```

---

## 🔧 Frontend .env faylini yangilash

Deploy tugagach, frontend `.env` faylini yangilang:

**Local development** (localhost):
```env
VITE_API_URL=http://localhost:3001
```

**Production** (online):
```env
VITE_API_URL=https://admin-backend-xxxx.onrender.com
```

---

## 🌐 Frontend ni deploy qilish

### Vercel (TAVSIYA)

1. [vercel.com](https://vercel.com) ga kiring
2. **New Project** → GitHub repo tanlang
3. **Environment Variables** qo'shing:
   ```
   VITE_API_URL=https://your-backend-url.com
   ```
4. **Deploy** tugmasini bosing

✅ **URL**: `https://your-app.vercel.app`

### Netlify

1. [netlify.com](https://netlify.com) ga kiring
2. **Add new site** → Import from Git
3. GitHub repo tanlang
4. **Build settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. **Environment variables** qo'shing
6. **Deploy** tugmasini bosing

✅ **URL**: `https://your-app.netlify.app`

---

## 📱 Linklar orqali ulashish

Deploy tugagach, sizda 2 ta link bo'ladi:

1. **Backend API**: `https://admin-backend-xxxx.onrender.com`
2. **Frontend**: `https://admin-dashboard-xxxx.vercel.app`

### Ulashish

Do'stlaringizga yoki mijozlaringizga faqat **Frontend linkini** yuboring:

```
https://admin-dashboard-xxxx.vercel.app
```

**Login ma'lumotlari**:
- Email: `admin@gmail.com`
- Password: `admin`

---

## 🔐 Custom Domain (O'z domeningiz)

### Vercel da custom domain

1. Vercel dashboard ga kiring
2. Loyihangizni tanlang
3. **Settings** → **Domains**
4. **Add** tugmasini bosing
5. Domeningizni kiriting (masalan: `admin.mydomain.com`)
6. DNS sozlamalarini o'zgartiring

### Render da custom domain

1. Render dashboard ga kiring
2. Service ni tanlang
3. **Settings** → **Custom Domains**
4. **Add Custom Domain** tugmasini bosing
5. DNS sozlamalarini o'zgartiring

---

## 📊 Ma'lumotlar bazasi (Production)

### Render.com da

**Masala**: Render bepul rejada serverlar 15 daqiqa faolsizlikdan keyin o'chadi.

**Yechim 1**: Paid plan ($7/oy) - Server doim ishlab turadi

**Yechim 2**: UptimeRobot ishlatish (BEPUL):

1. [uptimerobot.com](https://uptimerobot.com) ga ro'yxatdan o'ting
2. **Add New Monitor** tugmasini bosing
3. **Monitor Type**: HTTP(s)
4. **URL**: `https://your-backend.onrender.com/api/health`
5. **Monitoring Interval**: 5 daqiqa
6. **Save** tugmasini bosing

✅ UptimeRobot har 5 daqiqada backend serverga so'rov yuboradi va server uyg'onib turadi.

### Railway.app da

Railway da serverlar doim ishlab turadi (5$ kredit bepul beriladi).

---

## ⚡ Performance optimizatsiyalari

### 1. Frontend build optimizatsiyasi

`vite.config.ts` faylida:

```typescript
export default defineConfig({
  build: {
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router'],
        }
      }
    }
  }
})
```

### 2. Image optimization

Rasm URL larni CDN orqali yuklang:
- Cloudinary
- ImgIX
- Vercel Image Optimization

### 3. Caching

Backend `server.js` da:

```javascript
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'public, max-age=300'); // 5 daqiqa
  next();
});
```

---

## 🐛 Production muammolarni hal qilish

### Backend serverga ulanmayapti

**Tekshiring**:

1. ✅ Backend URL to'g'ri yozilganmi?
2. ✅ HTTPS bilan boshlanadimi?
3. ✅ CORS yoqilganmi?

**Test qiling**:
```
https://your-backend.onrender.com/api/health
```

### CORS xatoligi

Backend `server.js` da:

```javascript
const cors = require('cors');
app.use(cors({
  origin: ['https://your-frontend.vercel.app'],
  credentials: true
}));
```

### Build xatoligi

**Xatolik**: "Module not found"

**Yechim**: Barcha paketlar `dependencies` da bo'lishini tekshiring:

```bash
npm install --save package-name
```

---

## 📞 Yordam

### Backend ishlamayapti

1. Render dashboard ga kiring
2. Logs ni ko'ring
3. Environment variables ni tekshiring

### Frontend build bo'lmayapti

1. Vercel dashboard ga kiring
2. Deployment logs ni ko'ring
3. Environment variables ni tekshiring

### Ma'lumotlar saqlanmayapti

1. Backend server ishlab turganligini tekshiring
2. `database.json` fayli yaratilganligini tekshiring
3. Write permissions borligini tekshiring

---

## 🎉 Tayyor!

Loyihangiz endi internetda! 🚀

**Frontend**: `https://your-app.vercel.app`  
**Backend**: `https://your-backend.onrender.com`  
**Admin**: `admin@gmail.com` / `admin`

Linkni do'stlaringiz va mijozlaringiz bilan ulashing! 🔗

---

**Muvaffaqiyatli ishlar! 🌟**
