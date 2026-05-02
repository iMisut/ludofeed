# 🎲 LUDOFEED - Agregador de Feeds RSS

## 📋 Resumen del Proyecto Creado

Se ha generado una **aplicación web completa** (SPA) para agregar feeds RSS de múltiples sitios. Está lista para ser desplegada en **Render** sin necesidad de base de datos.

## ✅ Lo Que Se Ha Creado

### Backend (Node.js + Express + TypeScript)
```
backend/
├── src/
│   ├── server.ts                 # Servidor Express con rutas
│   ├── config.ts                 # Configuración global
│   ├── services/
│   │   ├── feedService.ts        # Obtiene, parsea y actualiza feeds RSS
│   │   └── cacheService.ts       # Gestiona caché en memoria
│   ├── routes/
│   │   ├── feeds.ts              # GET /api/feeds, /api/feeds/stats
│   │   └── sites.ts              # GET /api/sites, /api/sites/:id
│   └── types/
│       └── index.ts              # Tipos TypeScript compartidos
├── package.json                  # Dependencias y scripts
├── tsconfig.json                 # Configuración TypeScript
└── .env.example                  # Variables de entorno
```

**Características del Backend:**
- ✅ Obtiene feeds RSS de `https://misutmeeple.com/feeds.json`
- ✅ Parsea RSS 2.0 y Atom feeds
- ✅ Caché en memoria con expiración a 30 días
- ✅ Actualización automática cada 30 minutos
- ✅ Endpoints JSON con paginación
- ✅ CORS configurado para desarrollo y producción

### Frontend (Vue 3 + Vite + TypeScript + Tailwind)
```
frontend/
├── src/
│   ├── main.ts                   # Punto de entrada Vue
│   ├── App.vue                   # Componente raíz
│   ├── router.ts                 # Rutas (Home, Sites)
│   ├── components/
│   │   ├── NavBar.vue            # Barra de navegación
│   │   ├── FeedList.vue          # Listado con infinite scroll
│   │   ├── FeedItem.vue          # Elemento individual de feed
│   │   └── SitesList.vue         # Tabla ordenable de sitios
│   ├── views/
│   │   ├── Home.vue              # Vista principal de feeds
│   │   └── Sites.vue             # Vista de sitios web
│   ├── api/
│   │   └── client.ts             # Cliente axios para API
│   └── styles/
│       └── main.css              # Tailwind + estilos globales
├── index.html                    # Template HTML
├── package.json                  # Dependencias y scripts
├── vite.config.ts                # Configuración Vite
├── tailwind.config.js            # Configuración Tailwind
├── postcss.config.js             # PostCSS
└── .env.example                  # Variables de entorno
```

**Características del Frontend:**
- ✅ Diseño 100% responsivo (mobile-first)
- ✅ Infinite scroll sin paginación
- ✅ Búsqueda y filtrado de sitios
- ✅ Tabla ordenable por nombre/categoría
- ✅ Formateo inteligente de fechas ("hace 2 horas")
- ✅ Extracción de imágenes de feeds
- ✅ Manejo de errores con feedback visual
- ✅ Loading states y spinners

### Archivos de Configuración y Documentación
```
ludofeed/
├── README.md                     # Documentación principal
├── QUICKSTART.md                 # Guía de inicio rápido
├── DEPLOY.md                     # Guía de despliegue en Render
├── ARCHITECTURE.md               # Diagrama y mejoras técnicas
├── package.json                  # Scripts raíz
├── .gitignore                    # Archivos a ignorar
├── render.yaml                   # Configuración automática Render
├── docker-compose.yml            # Docker local
├── docker-compose.prod.yml       # Docker producción
├── Dockerfile.backend            # Contenedor del backend
├── Dockerfile.frontend           # Contenedor del frontend
├── feeds.example.json            # Ejemplo del archivo de feeds
└── scripts/                      # Scripts de utilidad
    ├── install-all.sh/.bat       # Instalar todas las dependencias
    ├── dev.sh/.bat               # Ejecutar en desarrollo
    ├── build.sh/.bat             # Compilar para producción
    ├── clean.sh/.bat             # Limpiar directorios
    ├── docker-up.sh/.bat         # Iniciar Docker
    └── docker-down.sh/.bat       # Detener Docker
```

## 🚀 Cómo Empezar

### Opción 1: Desarrollo Local Rápido (Recomendado)

**Windows:**
```bash
scripts\install-all.bat
scripts\dev.bat
```

**Mac/Linux:**
```bash
scripts/install-all.sh
scripts/dev.sh
```

O desde la raíz:
```bash
npm run install-all
npm run dev
```

Luego abre:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

### Opción 2: Con Docker

```bash
docker-compose up --build
```

### Opción 3: Instalación Manual

**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend (en otra terminal):**
```bash
cd frontend
npm install
npm run dev
```

## 🔧 Configuración Importante

### 1. Archivo de Feeds en misutmeeple.com

Debes crear un archivo JSON en `https://misutmeeple.com/feeds.json`:

```json
{
  "sources": [
    {
      "id": "blogtech",
      "name": "Blog Tecnológico",
      "url": "https://blogtech.com",
      "feedUrl": "https://blogtech.com/feed.xml",
      "description": "Noticias de tecnología",
      "image": "https://blogtech.com/logo.png",
      "category": "Tecnología"
    },
    {
      "id": "devoramas",
      "name": "Dev.to",
      "url": "https://dev.to",
      "feedUrl": "https://dev.to/rss",
      "description": "Comunidad de desarrolladores",
      "image": "https://dev.to/favicon.ico",
      "category": "Desarrollo"
    }
  ]
}
```

### 2. Variables de Entorno

**Backend (.env):**
```
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:5173
FEEDS_URL=https://misutmeeple.com/feeds.json
CACHE_EXPIRY_DAYS=30
FEED_CHECK_INTERVAL_MINUTES=5
```

**Frontend (.env):**
```
VITE_API_URL=http://localhost:3000/api
```

## 📱 Funcionalidades Principales

### Vista de Feeds (Página Principal)
- ✅ Listado scrolleable de todos los artículos
- ✅ Infinite scroll (carga 20 más al hacer scroll)
- ✅ Ordenados por fecha (más recientes primero)
- ✅ Cada artículo muestra:
  - Miniatura del artículo
  - Título (enlace a artículo)
  - Extracto de descripción
  - Autor
  - Nombre del sitio (con enlace)
  - Fecha formateada ("hace 2 horas")
  - Botón "Leer más"

### Vista de Sitios
- ✅ Tabla de todos los sitios disponibles
- ✅ Búsqueda en tiempo real por nombre/categoría
- ✅ Ordenamiento por nombre (A-Z, Z-A) o categoría
- ✅ Logo/imagen del sitio
- ✅ URL del sitio
- ✅ Descripción
- ✅ Botón "Visitar"

### Estadísticas
- ✅ Total de artículos en caché
- ✅ Fecha de última actualización
- ✅ Rango temporal (últimos 30 días)

## 🔄 Flujo Técnico

```
1. Backend inicia → Lee feeds de misutmeeple.com
2. Descarga y parsea todos los RSS → Almacena en caché
3. Cada 30 min → Comprueba nuevos artículos
4. Frontend → GET /api/feeds?offset=0&limit=20
5. Usuario hace scroll → GET /api/feeds?offset=20&limit=20
6. Infinite scroll automático
```

## 📦 APIs Disponibles

### GET /api/feeds?offset=0&limit=20
Obtiene feeds paginados.

### GET /api/feeds/stats
Obtiene estadísticas de caché.

### GET /api/sites
Obtiene todos los sitios.

### GET /api/sites/:id
Obtiene un sitio específico.

## 🐳 Despliegue en Render

### Automático (Recomendado)
1. Push a GitHub
2. Ve a render.com
3. Conecta tu repositorio
4. Render detectará `render.yaml` automáticamente
5. Se desplega backend y frontend automáticamente

### Manual
Ver `DEPLOY.md` para instrucciones detalladas.

## 📊 Estructura Completa

```
ludofeed/
├── backend/                 # API REST
│   ├── src/
│   ├── dist/               # Compilado (generado)
│   ├── node_modules/       # Dependencias (generado)
│   ├── package.json
│   └── tsconfig.json
├── frontend/               # SPA Vue 3
│   ├── src/
│   ├── dist/               # Build (generado)
│   ├── node_modules/       # Dependencias (generado)
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
├── scripts/                # Scripts de utilidad
├── package.json            # Scripts raíz
├── README.md               # Documentación
├── QUICKSTART.md           # Inicio rápido
├── DEPLOY.md               # Despliegue
├── ARCHITECTURE.md         # Arquitectura técnica
├── render.yaml             # Config Render
├── docker-compose.yml      # Docker local
└── .gitignore
```

## 🎯 Mejoras Implementadas

1. **Caché Inteligente** - Expiración automática, deduplicación
2. **Parseo Robusto** - RSS 2.0, Atom, manejo de errores
3. **Infinite Scroll** - Eficiente con IntersectionObserver
4. **Búsqueda/Filtrado** - En tiempo real
5. **Responsivo** - Funciona en todos los dispositivos
6. **TypeScript** - Tipado completo
7. **Docker Ready** - Contenedores incluidos
8. **Documentación** - Completa y detallada

## 💡 Próximas Mejoras Sugeridas

- [ ] Base de datos (MongoDB/PostgreSQL) para persistencia
- [ ] Autenticación de usuarios
- [ ] Guardar artículos favoritos
- [ ] Dark mode
- [ ] Soporte de idiomas (i18n)
- [ ] WebSockets para actualizaciones en tiempo real
- [ ] Analytics

## ✨ Características Técnicas

| Característica | Descripción |
|---|---|
| **Framework Frontend** | Vue 3 + Vite |
| **Framework Backend** | Express + Node.js 18+ |
| **Lenguaje** | TypeScript (100% tipado) |
| **Estilos** | Tailwind CSS |
| **Caché** | En memoria (expiración 30 días) |
| **Feeds** | RSS 2.0, Atom |
| **Scroll** | Infinite scroll |
| **Búsqueda** | Tiempo real |
| **Responsive** | Mobile-first |
| **Docker** | Incluido |
| **Deploy** | Render ready |

## 📚 Documentación

- **README.md** - Visión general y características
- **QUICKSTART.md** - Cómo empezar en 5 minutos
- **DEPLOY.md** - Despliegue detallado en Render
- **ARCHITECTURE.md** - Arquitectura técnica y mejoras

## 🎉 ¡Listo para usar!

Todo está configurado y listo para empezar. Solo necesitas:

1. Crear el archivo de feeds en misutmeeple.com
2. Ejecutar `npm run dev` (o los scripts)
3. Abrir http://localhost:5173

---

**Ludofeed** - Un agregador de feeds RSS moderno, rápido y fácil de desplegar.

¿Preguntas? Revisa la documentación o los archivos .md
