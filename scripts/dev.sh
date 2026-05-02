#!/bin/bash
# scripts/dev.sh
# Inicia tanto backend como frontend en desarrollo

echo "🚀 Iniciando Ludofeed en modo desarrollo..."
echo ""
echo "Frontend: http://localhost:5173"
echo "Backend:  http://localhost:3000"
echo ""

# Instalar concurrently si no está instalado
if ! npm list concurrently > /dev/null 2>&1; then
  echo "📦 Instalando concurrently..."
  npm install --save-dev concurrently
fi

# Instalar dependencias si no existen
if [ ! -d "backend/node_modules" ]; then
  echo "📦 Instalando dependencias de backend..."
  cd backend && npm install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
  echo "📦 Instalando dependencias de frontend..."
  cd frontend && npm install && cd ..
fi

# Ejecutar ambas aplicaciones
npm run dev
