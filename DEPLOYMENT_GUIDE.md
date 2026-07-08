# 🚀 Deployment Guide

## 📦 Deploy qilish bo'yicha qo'llanma

### 🎯 **1. NETLIFY'GA ADMIN PANEL DEPLOY QILISH**

#### A) GitHub orqali (Tavsiya etiladi):
1. [Netlify.com](https://netlify.com) saytiga kiring
2. **"Add new site"** → **"Import an existing project"** bosing
3. **GitHub** tanlang va `My-sklad` repo'sini tanlang
4. Quyidagi sozlamalarni kiriting:
   ```
   Base directory: Admin
   Build command: npm run build
   Publish directory: dist
   ```
5. **"Deploy site"** bosing
6. ✅ Tayyor! Sizga link beriladi (masalan: `https://your-app.netlify.app`)

#### B) Manual deploy (CLI orqali):
```bash
cd d:\beckend\Admin
npm run build
npx netlify-cli deploy --prod --dir=dist
```

---

### 🎯 **2. RENDER'GA BACKEND DEPLOY QILISH**

#### NestJS Swagger Backend:
1. [Render.com](https://render.com) saytiga kiring
2. **"New +"** → **"Web Service"** tanlang
3. GitHub repo'ni ulang: `My-sklad`
4. Quyidagi sozlamalarni kiriting:
   ```
   Name: admin-nestjs-backend
   Root Directory: (bo'sh qoldiring)
   Build Command: npm install && npm run build
   Start Command: npm run start:prod
   ```
5. Environment Variables:
   ```
   NODE_ENV=production
   PORT=3000
   DATABASE_URL=file:./dev.db
   JWT_SECRET=your-secret-key-here
   ```
6. **"Create Web Service"** bosing
7. ✅ Sizga URL beriladi: `https://admin-nestjs-backend.onrender.com`

#### Express Backend:
1. Render'da yana bir **"New Web Service"** yarating
2. Sozlamalar:
   ```
   Name: admin-express-backend
   Root Directory: Admin/backend
   Build Command: npm install
   Start Command: node server.js
   ```
3. Environment Variables:
   ```
   NODE_ENV=production
   PORT=3001
   ```
4. **"Create Web Service"** bosing
5. ✅ URL: `https://admin-express-backend.onrender.com`

---

### 🎯 **3. FRONTEND'NI BACKEND'GA ULASH**

Admin Panel'da API URL'larini o'zgartiring:

**Admin/src/config/api.ts** yarating:
```typescript
export const API_BASE_URL = 
  import.meta.env.MODE === 'production'
    ? 'https://admin-nestjs-backend.onrender.com'
    : 'http://localhost:3000';

export const EXPRESS_API_URL = 
  import.meta.env.MODE === 'production'
    ? 'https://admin-express-backend.onrender.com'
    : 'http://localhost:3001';
```

---

### 🔗 **FINAL LINKS:**

After deployment:
- 🌐 **Admin Panel**: `https://your-app.netlify.app`
- 📊 **NestJS Swagger**: `https://admin-nestjs-backend.onrender.com/api/docs`
- 📊 **Express Swagger**: `https://admin-express-backend.onrender.com/api-docs`

---

### ⚠️ **MUHIM ESLATMALAR:**

1. **Render Free Plan** - 15 daqiqadan keyin sleep rejimiga o'tadi
2. **Database** - SQLite ishlamaydi Render'da. PostgreSQL kerak bo'ladi
3. **CORS** - Backend'da CORS sozlamalarini tekshiring

---

### 📝 **DEPLOY QILISHDAN OLDIN:**

```bash
# 1. Build test qiling
cd d:\beckend\Admin
npm run build

# 2. Backend build test qiling
cd d:\beckend
npm run build

# 3. Barcha o'zgarishlarni Git'ga push qiling
git add -A
git commit -m "Production ready: Added deployment configs"
git push origin main
```

---

### 🎉 **TAYYOR!**

Endi Netlify va Render saytlariga kirib deploy qiling!
