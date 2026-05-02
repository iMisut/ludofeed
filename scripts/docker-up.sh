#!/bin/bash
# scripts/docker-up.sh
# Levanta los contenedores con Docker Compose

echo "🐳 Levantando contenedores Docker..."
docker-compose up --build

echo ""
echo "✅ Contenedores activos"
echo "Frontend: http://localhost:5173"
echo "Backend:  http://localhost:3000"
