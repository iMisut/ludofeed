#!/bin/bash
# scripts/install-all.sh
# Instala todas las dependencias del proyecto

echo "📦 Instalando dependencias de backend..."
cd backend
npm install
cd ..

echo "📦 Instalando dependencias de frontend..."
cd frontend
npm install
cd ..

echo "✅ Instalación completada!"
echo ""
echo "Para empezar, ejecuta:"
echo "  npm run dev"
