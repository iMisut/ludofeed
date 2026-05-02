import express from 'express';
import cors from 'cors';
import path from 'path'; // <-- NUEVO
import { fileURLToPath } from 'url'; // <-- NUEVO
import { config } from './config.js';
import { feedService } from './services/feedService.js';
import feedsRouter from './routes/feeds.js';
import sitesRouter from './routes/sites.js';

// Configuración para poder usar __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: [config.frontend_url, 'http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
  }),
);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/feeds', feedsRouter);
app.use('/api/sites', sitesRouter);

// --------------------------------------------------------
// NUEVO: Manejo del Frontend y errores 404
// --------------------------------------------------------

// 1. Si alguien pide una ruta de API que no existe, devolvemos tu error 404 en JSON
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// 2. Le decimos a Express dónde están los archivos estáticos de tu frontend.
// IMPORTANTE: Ajusta esta ruta si tu frontend no genera los archivos en 'frontend/dist'
const frontendDistPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(frontendDistPath));

// 3. Cualquier otra petición (que no sea /api/), devuelve tu index.html del frontend
// Esto es vital para que funcione la navegación en React/Vue/Svelte
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

// --------------------------------------------------------

// Error handler (lo mantenemos igual)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[Server] Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
async function start() {
  try {
    // Initialize feed service (load feeds from config)
    await feedService.initialize();

    app.listen(config.port, () => {
      console.log(`[Server] Running on port ${config.port}`);
      console.log(`[Server] Environment: ${config.node_env}`);
    });
  } catch (error) {
    console.error('[Server] Failed to start:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('[Server] SIGTERM signal received: closing HTTP server');
  feedService.stopSchedule();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('[Server] SIGINT signal received: closing HTTP server');
  feedService.stopSchedule();
  process.exit(0);
});

start().catch(error => {
  console.error('[Server] Fatal error:', error);
  process.exit(1);
});