@echo off
REM scripts\dev.bat
REM Inicia backend y frontend en desarrollo

echo 🚀 Iniciando Ludofeed en modo desarrollo...
echo.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:3000
echo.

echo 📦 Verificando dependencias...

if not exist backend\node_modules (
  echo 📦 Instalando dependencias de backend...
  cd backend
  call npm install
  cd ..
)

if not exist frontend\node_modules (
  echo 📦 Instalando dependencias de frontend...
  cd frontend
  call npm install
  cd ..
)

call npm run dev
