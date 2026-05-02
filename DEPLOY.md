# Ludofeed - Guía de Despliegue en Render

## Configuración Previa

### 1. Archivo de Feeds

El archivo de feeds ahora está **incluido en el proyecto** en `backend/feeds.json`. 

Para personalizar los feeds que deseas agregar:
1. Edita `backend/feeds.json`
2. Agrega o modifica los sitios RSS
3. Guarda los cambios

Formato de cada fuente:
```json
{
  "id": "unique-id",
  "name": "Nombre del Sitio",
  "url": "https://sitio.com",
  "feedUrl": "https://sitio.com/feed.xml",
  "description": "Descripción opcional",
  "image": "https://sitio.com/logo.png",
  "category": "Categoría"
}
```

### 2. Preparar el Repositorio

```bash
git init
git add .
git commit -m "Initial commit"
git push origin main
```

## Despliegue en Render

### Opción A: Usar render.yaml (Recomendado)

1. Push a tu repositorio en GitHub
2. Ve a [render.com](https://render.com)
3. Conecta tu repositorio de GitHub
4. Render detectará automáticamente el archivo `render.yaml`
5. Haz clic en "Deploy"

Esto desplegará automáticamente:
- **Backend**: Web Service (Node.js)
- **Frontend**: Static Site (Nginx)

### Opción B: Despliegue Manual

#### Backend

1. Ir a [render.com](https://render.com) → New + → Web Service
2. Conectar el repositorio
3. Configuración:
   - **Name**: ludofeed-backend
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. Environment Variables:
   ```
   NODE_ENV=production
   PORT=3000
   FEEDS_URL=https://misutmeeple.com/feeds.json
   CACHE_EXPIRY_DAYS=30
   FEED_CHECK_INTERVAL_MINUTES=30
   FRONTEND_URL=https://[tu-frontend-url].onrender.com
   ```
5. Deploy

#### Frontend

1. Ir a [render.com](https://render.com) → New + → Static Site
2. Conectar el repositorio
3. Configuración:
   - **Name**: ludofeed-frontend
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Environment Variables:
   ```
   VITE_API_URL=https://[tu-backend-url].onrender.com/api
   ```
5. Deploy

## URLs del Despliegue

Después del despliegue, tendrás:

- **Backend**: `https://ludofeed-backend.onrender.com`
- **Frontend**: `https://ludofeed-frontend.onrender.com`

## Variables de Entorno Importantes

| Variable | Backend | Frontend | Descripción |
|----------|---------|----------|-------------|
| `FRONTEND_URL` | ✅ | | URL del frontend (para CORS) |
| `VITE_API_URL` | | ✅ | URL del API backend |
| `CACHE_EXPIRY_DAYS` | ✅ | | Días que los items se mantienen en caché (default: 30) |
| `FEED_CHECK_INTERVAL_MINUTES` | ✅ | | Minutos entre comprobaciones de feeds (default: 30) |

## Monitoreo

### Health Check Backend

Render verificará automáticamente:
```
GET https://ludofeed-backend.onrender.com/health
```

### Logs

Accede a los logs desde el dashboard de Render:
1. Selecciona el servicio
2. Ve a la pestaña "Logs"
3. Verás todos los eventos del servidor

## Problemas Comunes

### Error: CORS
- Verifica que `FRONTEND_URL` en el backend sea la URL correcta del frontend

### Error: No se encuentran los feeds
- Verifica que el archivo `backend/feeds.json` existe
- Comprueba que el JSON es válido
- Revisa los logs del backend

### La instancia se detiene
- Render detiene los servicios gratuitos después de 15 minutos de inactividad
- La aplicación debe cargar la caché al iniciar (está configurada)
- Los feeds se actualizan automáticamente cada 30 minutos

## Optimizaciones para Render (Free Tier)

- El backend usa caché en memoria (se pierde al reiniciar)
- Los feeds se cargan al iniciar la aplicación desde `feeds.json`
- El frontend es una SPA estática servida por Nginx (rápido)
- Se recomienda aumentar `FEED_CHECK_INTERVAL_MINUTES` a 60 en producción

## Actualización de Contenido

Para agregar o modificar feeds:

1. Edita `backend/feeds.json` en tu repositorio
2. Haz push a GitHub
3. Render redeploy automáticamente o manualmente desde el dashboard
4. La próxima comprobación de feeds (cada 30 minutos) incluirá los cambios

## Recursos

- [Documentación de Render](https://render.com/docs)
- [Node.js en Render](https://render.com/docs/deploy-node-express-app)
- [Static Sites en Render](https://render.com/docs/static-sites)
