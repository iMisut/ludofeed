#!/bin/bash
# scripts/build.sh
# Compila backend y frontend para producción

echo "🔨 Compilando backend..."
cd backend
npm install
npm run build
cd ..

echo "🔨 Compilando frontend..."
cd frontend
npm install
npm run build
cd ..

echo "✅ Build completado!"
echo ""
echo "Backend compilado en: backend/dist"
echo "Frontend compilado en: frontend/dist"
