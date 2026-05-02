@echo off
REM scripts\clean.bat
REM Limpia directorios de compilación y node_modules

echo 🧹 Limpiando proyecto...

echo   Limpiando backend...
cd backend
if exist dist rmdir /s /q dist
if exist node_modules rmdir /s /q node_modules
cd ..

echo   Limpiando frontend...
cd frontend
if exist dist rmdir /s /q dist
if exist node_modules rmdir /s /q node_modules
cd ..

echo ✅ Limpieza completada!
echo.
echo Para reinstalar dependencias:
echo   npm run install-all
pause
