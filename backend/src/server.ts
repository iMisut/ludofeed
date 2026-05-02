import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import { feedService } from './services/feedService.js';
import feedsRouter from './routes/feeds.js';
import sitesRouter from './routes/sites.js';

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

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
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
