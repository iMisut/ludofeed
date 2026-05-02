#!/bin/bash
# scripts/clean.sh
# Limpia directorios de compilación y node_modules

echo "🧹 Limpiando proyecto..."

echo "  Limpiando backend..."
cd backend
rm -rf dist node_modules
cd ..

echo "  Limpiando frontend..."
cd frontend
rm -rf dist node_modules
cd ..

echo "✅ Limpieza completada!"
echo ""
echo "Para reinstalar dependencias:"
echo "  npm run install-all"
