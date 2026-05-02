@echo off
REM scripts\docker-up.bat
REM Levanta los contenedores con Docker Compose

echo 🐳 Levantando contenedores Docker...
call docker-compose up --build

echo.
echo ✅ Contenedores activos
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:3000
pause
