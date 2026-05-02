@echo off
REM scripts\build.bat
REM Compila backend y frontend para producción

echo 🔨 Compilando backend...
cd backend
call npm install
call npm run build
cd ..

echo 🔨 Compilando frontend...
cd frontend
call npm install
call npm run build
cd ..

echo ✅ Build completado!
echo.
echo Backend compilado en: backend\dist
echo Frontend compilado en: frontend\dist
pause
