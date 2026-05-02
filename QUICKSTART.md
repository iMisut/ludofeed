# Guía de Inicio Rápido - Ludofeed

## 🚀 Empezar en 5 minutos

### Opción 1: Instalación Local Manual

#### 1. Instalar dependencias del Backend

```bash
cd backend
npm install
```

#### 2. Instalar dependencias del Frontend

```bash
cd frontend
npm install
```

#### 3. Ejecutar Backend (en una terminal)

```bash
cd backend
npm run dev
```

> El backend estará disponible en `http://localhost:3000`

#### 4. Ejecutar Frontend (en otra terminal)

```bash
cd frontend
npm run dev
```

> El frontend estará disponible en `http://localhost:5173`

### Opción 2: Instalar Todo Junto (desde la raíz)

```bash
npm run install-all
npm run dev
```

> Esto abrirá tanto el backend como el frontend automáticamente.

### Opción 3: Docker Compose

```bash
docker-compose up --build
```

> El frontend estará en `http://localhost:5173` y el backend en `http://localhost:3000`

## 🔧 Configuración del Archivo de Feeds

El archivo de feeds está incluido en el proyecto en: `backend/feeds.json`

Para personalizar los feeds:
1. Abre `backend/feeds.json`
2. Edita, agrega o quita fuentes RSS
3. Guarda los cambios
4. Reinicia el backend

**Formato de cada fuente**:
```json
{
  "sources": [
    {
      "id": "unique-id",
      "name": "Nombre del Sitio",
      "url": "https://sitio.com",
      "feedUrl": "https://sitio.com/feed.xml",
      "description": "Descripción",
      "image": "https://sitio.com/logo.png",
      "category": "Categoría"
    }
  ]
}
```

Consulta `feeds.example.json` para un ejemplo completo.

## 📝 Desarrollo

### Backend (Node.js + TypeScript)

```bash
cd backend
npm run dev        # Inicia servidor con hot-reload
npm run build      # Compila TypeScript
npm start          # Inicia servidor compilado
```

**Estructura**:
- `src/server.ts` - Punto de entrada
- `src/services/` - Lógica de negocio
- `src/routes/` - Endpoints de API
- `src/types/` - Tipos TypeScript

### Frontend (Vue 3 + Vite)

```bash
cd frontend
npm run dev        # Inicia dev server con hot-reload
npm run build      # Construye para producción
npm run preview    # Previsualiza build
```

**Estructura**:
- `src/views/` - Páginas
- `src/components/` - Componentes reutilizables
- `src/api/` - Cliente HTTP
- `src/router.ts` - Configuración de rutas

## 🌐 APIs Disponibles

### Feeds

```bash
# Obtener feeds paginados
GET http://localhost:3000/api/feeds?offset=0&limit=20

# Obtener estadísticas
GET http://localhost:3000/api/feeds/stats
```

### Sitios

```bash
# Obtener todos los sitios
GET http://localhost:3000/api/sites

# Obtener un sitio específico
GET http://localhost:3000/api/sites/:id
```

## 🐛 Debugging

### Backend

Los logs aparecen en la terminal donde corres `npm run dev`:
- `[Server]` - Eventos del servidor
- `[FeedService]` - Eventos de feeds
- `[CacheService]` - Eventos de caché

### Frontend

Abre las Developer Tools del navegador (F12):
- **Console**: Errores y logs
- **Network**: Peticiones a la API
- **Application**: LocalStorage y sesión

## 🚀 Build para Producción

### Backend

```bash
cd backend
npm run build
```

Esto genera `backend/dist/` listo para Render.

### Frontend

```bash
cd frontend
npm run build
```

Esto genera `frontend/dist/` listo para Render.

## 📦 Estructura de Carpetas

```
ludofeed/
├── backend/                    # API (Node.js + Express)
│   ├── src/
│   │   ├── server.ts          # App principal
│   │   ├── config.ts          # Configuración
│   │   ├── services/          # Lógica
│   │   ├── routes/            # Endpoints
│   │   └── types/             # Tipos
│   ├── dist/                  # Código compilado
│   └── package.json
│
├── frontend/                   # SPA (Vue 3 + Vite)
│   ├── src/
│   │   ├── components/        # Componentes
│   │   ├── views/             # Páginas
│   │   ├── api/               # Cliente HTTP
│   │   └── styles/            # CSS
│   ├── dist/                  # Build para producción
│   └── package.json
│
├── docker-compose.yml         # Docker local
├── render.yaml                # Configuración Render
├── DEPLOY.md                  # Guía de despliegue
└── README.md                  # Documentación
```

## 💡 Tips de Desarrollo

1. **Hot Reload**: Ambas aplicaciones se recargan automáticamente al editar archivos
2. **TypeScript**: Aprovecha el tipado para evitar errores
3. **CORS**: Durante desarrollo, el backend permite localhost
4. **Cache**: Durante desarrollo, se actualiza cada 5 minutos (vs 30 en prod)

## ❓ Problemas Comunes

### Puerto 3000 ya está en uso
```bash
# Cambiar puerto en backend
# Edita backend/.env y cambia PORT=3001
```

### Puerto 5173 ya está en uso
```bash
# Vite usa el siguiente puerto disponible automáticamente
```

### Error: Cannot find module
```bash
# Reinstalar dependencias
cd backend && rm -rf node_modules && npm install
cd frontend && rm -rf node_modules && npm install
```

### CORS error
```bash
# Verifica que el backend está corriendo
# Frontend debe conectarse a http://localhost:3000/api
```

## 📚 Recursos

- [Vue 3 Docs](https://vuejs.org/)
- [Express Docs](https://expressjs.com/)
- [TypeScript Docs](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Render Docs](https://render.com/docs)

---

¿Necesitas ayuda? Revisa README.md o DEPLOY.md para más información.
