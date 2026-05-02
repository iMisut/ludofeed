import express, { Request, Response } from 'express';
import { feedService } from '../services/feedService.js';

const router = express.Router();

/**
 * GET /api/sites
 * Get all feed sources
 */
router.get('/', (req: Request, res: Response) => {
  try {
    const sources = feedService.getSources();

    // Map to response format (exclude internal feedUrl)
    const sites = sources.map(source => ({
      id: source.id,
      name: source.name,
      url: source.url,
      description: source.description,
      image: source.image,
      category: source.category,
    }));

    res.json({
      items: sites,
      total: sites.length,
    });
  } catch (error) {
    console.error('[Sites Route] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/sites/:id
 * Get a specific site
 */
router.get('/:id', (req: Request, res: Response) => {
  try {
    const source = feedService.getSource(req.params.id);

    if (!source) {
      return res.status(404).json({ error: 'Site not found' });
    }

    const site = {
      id: source.id,
      name: source.name,
      url: source.url,
      description: source.description,
      image: source.image,
      category: source.category,
    };

    res.json(site);
  } catch (error) {
    console.error('[Sites Route] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
