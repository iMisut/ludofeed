# Testing Guide - Ludofeed

## ✅ Checklist de Validación

### Backend

```bash
cd backend
npm run dev
```

- [ ] Servidor inicia en puerto 3000
- [ ] GET http://localhost:3000/health retorna `{"status": "ok"}`
- [ ] GET http://localhost:3000/api/feeds retorna JSON
- [ ] GET http://localhost:3000/api/feeds/stats retorna estadísticas
- [ ] GET http://localhost:3000/api/sites retorna sitios
- [ ] Logs muestran: "[FeedService] Fetching all feeds..."

### Frontend

```bash
cd frontend
npm run dev
```

- [ ] Servidor inicia en puerto 5173
- [ ] Página carga sin errores en console
- [ ] NavBar se muestra correctamente
- [ ] Feeds se cargan en página principal
- [ ] Existe navegación "Feeds" y "Sitios"
- [ ] Infinite scroll funciona (scroll down → cargan más)
- [ ] Búsqueda en página de Sitios funciona

## 🧪 Pruebas Manuales

### Prueba 1: Cargar Feeds
```bash
curl http://localhost:3000/api/feeds
```
Debe retornar:
- Array de items
- Total > 0
- Paginación correcta

### Prueba 2: Cargar Sitios
```bash
curl http://localhost:3000/api/sites
```
Debe retornar:
- Array de sitios
- Nombre, URL, descripción

### Prueba 3: Stats
```bash
curl http://localhost:3000/api/feeds/stats
```
Debe retornar:
- totalItems > 0
- lastUpdated (timestamp)
- oldestItem y newestItem

### Prueba 4: Paginación
```bash
curl "http://localhost:3000/api/feeds?offset=0&limit=5"
curl "http://localhost:3000/api/feeds?offset=5&limit=5"
```
Cada request debe retornar diferentes items

### Prueba 5: Validación
```bash
# Parámetros inválidos
curl "http://localhost:3000/api/feeds?offset=-1&limit=20"
curl "http://localhost:3000/api/feeds?offset=0&limit=200"
```
Debe retornar error 400

## 📱 Pruebas de Frontend

### Test 1: Responsive Design
- [ ] Desktop (1920px) - Se ve bien
- [ ] Tablet (768px) - Se ve bien
- [ ] Mobile (375px) - Se ve bien
- [ ] Menú móvil funciona en pantallas pequeñas

### Test 2: Infinite Scroll
- [ ] Primera carga: 20 items
- [ ] Scroll al fondo: Carga 20 más
- [ ] Repetir: Continúa cargando

### Test 3: Búsqueda de Sitios
- [ ] Escribir en buscador: Filtra resultados
- [ ] Borrar búsqueda: Muestra todos
- [ ] Búsqueda parcial: Funciona

### Test 4: Ordenamiento
- [ ] Nombre A-Z: Ordena alfabéticamente
- [ ] Nombre Z-A: Ordena inverso
- [ ] Categoría: Agrupa por categoría

### Test 5: Enlaces
- [ ] Links a artículos abren en nueva pestaña
- [ ] Links a sitios abren en nueva pestaña
- [ ] "Leer más" funciona

### Test 6: Error Handling
- [ ] Backend caído: Muestra error en frontend
- [ ] Reconecta automáticamente
- [ ] Botón "Reintentar" funciona

## 🐳 Pruebas con Docker

```bash
# Levanta contenedores
docker-compose up --build

# Accede a logs
docker-compose logs -f

# Detiene
docker-compose down
```

- [ ] Backend contenedor inicia
- [ ] Frontend contenedor inicia
- [ ] Se comunican correctamente
- [ ] No hay errores en logs

## 🔍 Pruebas de Rendimiento

### Desktop
```
Expected:
- LCP: < 2s
- FID: < 100ms
- Scroll: Smooth (60fps)
```

### Mobile
```
Expected:
- LCP: < 3s
- FID: < 200ms
- Scroll: Smooth
```

### Backend
```
Expected:
- /api/feeds: < 100ms
- /api/sites: < 50ms
- Memory: 50-100MB
```

## 🔐 Pruebas de Seguridad

- [ ] CORS permite orígenes correctos
- [ ] CORS rechaza orígenes no permitidos
- [ ] SQL Injection: No aplicable (sin DB)
- [ ] XSS: HTML se escapa correctamente
- [ ] Rate limiting: (Futuro)

## 🚀 Pruebas de Despliegue

### Build para Producción
```bash
npm run build
```

- [ ] Sin errores
- [ ] Backend dist/ se genera
- [ ] Frontend dist/ se genera
- [ ] Tamaño razonable

### Local Production Build
```bash
# Backend
cd backend
npm run build
npm start

# Frontend (serve dist/)
npx serve frontend/dist
```

- [ ] Todo funciona igual que dev
- [ ] Sin console errors
- [ ] Performance es mejor

## 📋 Checklist Final

### Backend
- [ ] Instala dependencias
- [ ] Compila TypeScript
- [ ] Inicia sin errores
- [ ] Todos los endpoints funcionan
- [ ] Logs son claros
- [ ] Manejo de errores

### Frontend
- [ ] Instala dependencias
- [ ] Construye sin errores
- [ ] Carga en navegador
- [ ] Componentes se renderizan
- [ ] Peticiones a API funcionan
- [ ] Responsive en todos los dispositivos

### Documentación
- [ ] README.md completo
- [ ] QUICKSTART.md funciona
- [ ] DEPLOY.md es claro
- [ ] ARCHITECTURE.md explica diseño

### DevOps
- [ ] Docker compose funciona
- [ ] .gitignore correcto
- [ ] .env.example tiene placeholders
- [ ] render.yaml es válido

## 🐛 Troubleshooting

### Backend no inicia
```bash
# Verificar puerto
lsof -i :3000

# Limpiar
cd backend && rm -rf node_modules dist && npm install
```

### Frontend no conecta con backend
```bash
# Verificar que backend está corriendo
curl http://localhost:3000/health

# Verificar VITE_API_URL en .env
cat frontend/.env
```

### Feeds no cargan
```bash
# Verificar que FEEDS_URL es accesible
curl https://misutmeeple.com/feeds.json

# Verificar formato JSON
# Debe ser válido
```

### Docker problemas
```bash
# Limpiar
docker-compose down -v
docker system prune

# Rebuild
docker-compose up --build
```

---

Ejecuta estas pruebas antes de hacer push a producción.
