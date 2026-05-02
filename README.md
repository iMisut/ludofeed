# Ludofeed - Agregador de Feeds RSS

Una aplicación web moderna para agregar y consumir feeds RSS de tus sitios web favoritos. Construida con Vue 3, Node.js y Express.

## 🚀 Características

- ✅ **Agregación de Feeds RSS**: Obtén contenido de múltiples sitios en un único lugar
- ✅ **Vista Responsiva**: Interfaz adaptada para desktop, tablet y móvil
- ✅ **Infinite Scroll**: Carga automática de más artículos al desplazarse
- ✅ **Filtrado por Fecha**: Solo muestra artículos de los últimos 30 días
- ✅ **Listado de Sitios**: Consulta todos los sitios disponibles con búsqueda y ordenamiento
- ✅ **Caché Automática**: El servidor carga la caché al iniciar
- ✅ **Actualizaciones Periódicas**: Comprueba nuevos artículos cada 30 minutos
- ✅ **Desplegable en Render**: Listo para producción

## 📋 Requisitos

- Node.js 18+
- npm o yarn

## 🛠️ Instalación Local

### Backend

```bash
cd backend
npm install
npm run dev
```

El servidor correrá en `http://localhost:3000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 📦 Estructura del Proyecto

```
ludofeed/
├── backend/                    # API REST (Node.js + Express)
│   ├── src/
│   │   ├── server.ts          # Punto de entrada del servidor
│   │   ├── config.ts          # Configuración global
│   │   ├── services/
│   │   │   ├── feedService.ts # Lógica de obtención de feeds
│   │   │   └── cacheService.ts# Gestión de caché
│   │   ├── routes/
│   │   │   ├── feeds.ts       # Endpoints de feeds
│   │   │   └── sites.ts       # Endpoints de sitios
│   │   └── types/
│   │       └── index.ts       # Tipos TypeScript
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/                   # SPA (Vue 3 + Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── NavBar.vue     # Barra de navegación
│   │   │   ├── FeedList.vue   # Listado de feeds
│   │   │   ├── FeedItem.vue   # Elemento de feed
│   │   │   └── SitesList.vue  # Listado de sitios
│   │   ├── views/
│   │   │   ├── Home.vue       # Página principal
│   │   │   └── Sites.vue      # Página de sitios
│   │   ├── api/
│   │   │   └── client.ts      # Cliente HTTP
│   │   ├── styles/
│   │   │   └── main.css       # Estilos globales
│   │   ├── router.ts          # Configuración de rutas
│   │   ├── App.vue            # Componente raíz
│   │   └── main.ts            # Punto de entrada
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── .env.example
│
└── README.md
```

## 🔧 Configuración

### Archivo de Feeds (misutmeeple.com)

El archivo debe tener la siguiente estructura JSON:

```json
{
  "sources": [
    {
      "id": "site1",
      "name": "Mi Sitio Web",
      "url": "https://mysite.com",
      "feedUrl": "https://mysite.com/feed.xml",
      "description": "Descripción del sitio",
      "image": "https://mysite.com/logo.png",
      "category": "Categoría"
    }
  ]
}
```

### Variables de Entorno

**Backend (.env)**:
```
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://tu-dominio.com
FEEDS_URL=https://misutmeeple.com/feeds.json
CACHE_EXPIRY_DAYS=30
FEED_CHECK_INTERVAL_MINUTES=30
```

**Frontend (.env)**:
```
VITE_API_URL=https://tu-api.com/api
```

## 📡 Endpoints de API

### Feeds

- **GET** `/api/feeds?offset=0&limit=20` - Obtener feeds paginados
- **GET** `/api/feeds/stats` - Obtener estadísticas de caché

### Sitios

- **GET** `/api/sites` - Obtener todos los sitios
- **GET** `/api/sites/:id` - Obtener un sitio específico

## 🚀 Despliegue en Render

### Backend

1. Conectar el repositorio a Render
2. Crear un nuevo Web Service
3. Configurar:
   - **Build Command**: `cd backend && npm install && npm run build`
   - **Start Command**: `cd backend && npm start`
   - **Environment**: Production
4. Agregar variables de entorno

### Frontend

1. Crear un nuevo Static Site
2. Configurar:
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish directory**: `frontend/dist`
3. Configurar variable: `VITE_API_URL` con la URL del backend

## 🎯 Mejoras Implementadas

- **Interfaz Moderna**: Diseño limpio con Tailwind CSS
- **TypeScript**: Tipado completo para mayor seguridad
- **Manejo de Errores**: Feedback visual claro para el usuario
- **Responsive**: Funciona perfectamente en todos los dispositivos
- **Performance**: Infinite scroll eficiente sin paginación
- **SEO**: Meta tags y títulos dinámicos
- **Accesibilidad**: Semántica HTML correcta

## 🔒 Características de Seguridad

- CORS configurado
- Validación de parámetros en API
- Timeouts en peticiones a feeds
- Manejo seguro de errores

## 📝 Notas Técnicas

- La caché se almacena en memoria (se pierde al reiniciar)
- Los items expiran a los 30 días de publicación
- Se verifica la disponibilidad de feeds cada 30 minutos
- Soporta RSS 2.0 y Atom feeds
- Extrae automáticamente imágenes de los feeds

## 🤝 Contribuir

Este proyecto está configurado para desarrollo local con hot-reload en ambas aplicaciones.

Para cambios de estructura, edita los archivos en:
- Backend: `backend/src/`
- Frontend: `frontend/src/`

## 📄 Licencia

MIT

---

**Nota**: Recuerda mantener actualizado el archivo de feeds en `misutmeeple.com` para que la aplicación funcione correctamente.
