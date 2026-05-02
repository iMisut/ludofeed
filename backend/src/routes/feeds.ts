import express, { Request, Response } from 'express';
import { cacheService } from '../services/cacheService.js';

const router = express.Router();

/**
 * GET /api/feeds
 * Get paginated feed items
 */
router.get('/', (req: Request, res: Response) => {
  try {
    const offset = parseInt(req.query.offset as string) || 0;
    const limit = parseInt(req.query.limit as string) || 20;

    // Validate pagination parameters
    if (offset < 0 || limit < 1 || limit > 100) {
      return res.status(400).json({
        error: 'Invalid pagination parameters. Limit must be between 1 and 100.',
      });
    }

    const result = cacheService.getPaginatedItems(offset, limit);
    res.json(result);
  } catch (error) {
    console.error('[Feeds Route] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/feeds/stats
 * Get cache statistics
 */
router.get('/stats', (req: Request, res: Response) => {
  try {
    const stats = cacheService.getStats();
    res.json(stats);
  } catch (error) {
    console.error('[Feeds Route] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
