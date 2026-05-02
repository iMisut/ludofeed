@echo off
REM scripts\install-all.bat
REM Instala todas las dependencias del proyecto

echo 📦 Instalando dependencias de backend...
cd backend
call npm install
cd ..

echo 📦 Instalando dependencias de frontend...
cd frontend
call npm install
cd ..

echo ✅ Instalación completada!
echo.
echo Para empezar, ejecuta:
echo   npm run dev
pause
