# 🚀 Ngrok Sozlash va Ishlatish

## 📋 Birinchi Marta Sozlash (Faqat 1 Marta)

### 1. Ngrok Yuklab Oling

1. Saytga kiring: https://ngrok.com/download
2. **Windows** versiyasini yuklab oling
3. Zip faylni oching
4. `ngrok.exe` ni `d:\beckend\` papkasiga ko'chiring

### 2. Ngrok Account Yarating (Bepul)

1. https://dashboard.ngrok.com/signup ga kiring
2. Account yarating (Google bilan ham bo'ladi)
3. **Authtoken** ni oling: https://dashboard.ngrok.com/get-started/your-authtoken

### 3. Authtoken Sozlang (Faqat 1 Marta)

Terminal yoki CMD da:

```bash
cd d:\beckend
ngrok config add-authtoken SIZNING_TOKEN_SHU_YERDA
```

Masalan:
```bash
ngrok config add-authtoken 2abc123def456ghi789jkl
```

### 4. Custom Domain Oling (Agar yo'q bo'lsa)

1. https://dashboard.ngrok.com/domains ga kiring
2. **+ New Domain** bosing
3. **Free** domain tanlang
4. Domain nomini ko'chirib oling (masalan: `lather-shortwave-chief.ngrok-free.dev`)

---

## 🎯 Ishlatish (Har Gal)

### VARIANT 1: Hammasi Avtomatik (TAVSIYA) ⭐

**Windows Explorer** da `d:\beckend\start-all.bat` ni ikki marta bosing!

- ✅ Backend avtomatik ishga tushadi
- ✅ Ngrok avtomatik ulanadi
- ✅ 2 ta terminal ochiladi
- ✅ Link tayyor!

**Link:**
```
https://lather-shortwave-chief.ngrok-free.dev/api/docs
```

---

### VARIANT 2: Faqat Ngrok (Backend allaqachon ishlab tursa)

**Windows Explorer** da `d:\beckend\start-ngrok.bat` ni ikki marta bosing!

- ✅ Faqat Ngrok ishga tushadi
- ✅ Backend allaqachon ishlab turishi kerak

---

### VARIANT 3: Qo'lda (Terminal)

#### Terminal 1 - Backend:
```bash
cd d:\beckend
npm run start:dev
```

#### Terminal 2 - Ngrok:
```bash
cd d:\beckend
ngrok http 3000 --domain=lather-shortwave-chief.ngrok-free.dev
```

---

## 📱 Link Tekshirish

### 1. Localhost Test:
```
http://localhost:3000/api/docs
```
Bu ishlamasa - backend ishlamayapti!

### 2. Ngrok Test:
```
https://lather-shortwave-chief.ngrok-free.dev/api/docs
```
Bu sizning public linkingiz!

---

## ⚠️ Muhim Qoidalar

1. **Terminallarni YOPMANG!**
   - Backend terminali yopilsa - backend to'xtaydi
   - Ngrok terminali yopilsa - link ishlamaydi

2. **Kompyuterni o'chirmaslik**
   - Uyquga ketsa ham link ishlamay qoladi
   - Uyquga ketmasin deb sozlang

3. **Internet Ulanishi**
   - Wi-Fi uzilib qolsa - link ishlamaydi
   - Internetingiz tez bo'lishi kerak

---

## 🔧 Muammolarni Hal Qilish

### 1. "ngrok: command not found"

**Yechim:** ngrok.exe ni `d:\beckend\` ga qo'ying yoki PATH ga qo'shing

```bash
# Yoki to'liq yo'l bilan ishlating
d:\beckend\ngrok.exe http 3000 --domain=lather-shortwave-chief.ngrok-free.dev
```

### 2. "Failed to start tunnel"

**Yechim:** Authtoken sozlang

```bash
ngrok config add-authtoken SIZNING_TOKEN
```

### 3. "Port 3000 already in use"

**Yechim:** Backend allaqachon ishlab turibdi, faqat ngrok ishga tushiring

### 4. "503 Tunnel Unavailable"

**Sabab:** Backend ishlamayapti

**Yechim:**
```bash
# Backendni ishga tushiring
npm run start:dev
```

### 5. Domain ishlamaydi

**Yechim:** Ngrok dashboarddan yangi domain oling va scriptda o'zgartiring

---

## 📊 Ngrok Status Tekshirish

Ngrok terminal ochiq bo'lganda ko'rasiz:

```
Session Status    online
Account           sizning_accountingiz
Forwarding        https://lather-shortwave-chief.ngrok-free.dev -> http://localhost:3000
```

---

## 🎁 Qisqartmalar

### Windows Desktop ga Shortcut

1. `start-all.bat` ga o'ng tugma bosing
2. **Send to** > **Desktop (create shortcut)**
3. Desktop dan to'g'ridan ishga tushiring!

### Startup ga Qo'shish (Avtomatik Ishga Tushishi Uchun)

1. `Win + R` bosing
2. `shell:startup` yozing
3. `start-all.bat` ni shortcut qilib shu yerga qo'ying
4. Kompyuter yonganda avtomatik ishga tushadi!

---

## 💡 Pro Tips

### 1. Terminal Yopilmasligi Uchun:

`start-all.bat` ga o'ng tugma > **Run as administrator**

### 2. Uyquga Ketmasligi Uchun:

**Windows Settings** > **System** > **Power & sleep** > **Never**

### 3. Doimiy Ishlashi Uchun:

**Task Scheduler** da har 5 daqiqada ping qilish:

```bash
curl https://lather-shortwave-chief.ngrok-free.dev/api/v1
```

---

## 📞 Yordam

Agar muammo bo'lsa:

1. Localhost test qiling: http://localhost:3000/api/docs
2. Ngrok status tekshiring: terminalni ko'ring
3. Loglarni o'qing: xatolar ko'rinadi
4. Menga savol bering!

---

## ✅ Tayyor Checklist

- [ ] Ngrok yuklab oldingizmi?
- [ ] Ngrok.exe ni `d:\beckend\` ga qo'ydingizmi?
- [ ] Account yaratdingizmi?
- [ ] Authtoken sozladingizmi?
- [ ] Custom domain oldingizmi?
- [ ] Backend ishga tushdimi?
- [ ] Ngrok ulandimi?
- [ ] Link ishlayaptimi?

Hammasi ✅ bo'lsa - **TAYYOR!** 🎉
