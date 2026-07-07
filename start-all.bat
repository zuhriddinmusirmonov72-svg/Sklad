@echo off
echo ================================================
echo   E-Commerce Backend va Ngrok Ishga Tushirilmoqda
echo ================================================
echo.

REM Backend ni ishga tushirish (yangi terminal)
echo [1/2] Backend ishga tushirilmoqda...
start "Backend Server" cmd /k "cd /d %~dp0 && npm run start:dev"

REM 10 soniya kutish (backend to'liq ishga tushishi uchun)
echo [INFO] Backend ishga tushishi uchun 10 soniya kutilmoqda...
timeout /t 10 /nobreak >nul

REM Ngrok ni ishga tushirish (yangi terminal)
echo [2/2] Ngrok tunnel ochilmoqda...
start "Ngrok Tunnel" cmd /k "cd /d %~dp0 && ngrok http 3000 --domain=lather-shortwave-chief.ngrok-free.dev"

echo.
echo ================================================
echo   TAYYOR!
echo ================================================
echo.
echo   Backend:  http://localhost:3000/api/docs
echo   Ngrok:    https://lather-shortwave-chief.ngrok-free.dev/api/docs
echo.
echo   MUHIM: Ikkala terminal ham ochiq turishi kerak!
echo.
echo ================================================

pause
