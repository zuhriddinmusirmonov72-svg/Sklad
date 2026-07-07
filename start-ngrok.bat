@echo off
echo ================================================
echo   Ngrok Tunnel Ishga Tushirilmoqda...
echo ================================================
echo.

REM Ngrok ni ishga tushirish
echo [INFO] Ngrok 3000 portni internetga ochmoqda...
echo [INFO] Terminal yopilmasin!
echo.
echo [SUCCESS] Link tayyor: https://lather-shortwave-chief.ngrok-free.dev/api/docs
echo.
echo ================================================
echo   MUHIM: Bu oynani yopmang!
echo   Yopsangiz - link ishlamay qoladi
echo ================================================
echo.

ngrok http 3000 --domain=lather-shortwave-chief.ngrok-free.dev

pause
