@echo off
REM scripts\docker-down.bat
REM Detiene los contenedores

echo 🐳 Deteniendo contenedores...
call docker-compose down

echo ✅ Contenedores detenidos
pause
