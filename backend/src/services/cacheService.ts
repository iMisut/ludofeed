import { FeedItem } from '../types/index.js';
import { config, MILLISECONDS_PER_DAY } from '../config.js';

class CacheService {
  private cache: FeedItem[] = [];
  private lastUpdated: Date = new Date(0);

  /**
   * Add items to cache, replacing existing items with same ID
   */
  addItems(items: FeedItem[]): void {
    const now = new Date();
    const itemIds = new Set(items.map(item => item.id));

    // Remove items that will be replaced
    this.cache = this.cache.filter(item => !itemIds.has(item.id));

    // Add new items
    this.cache.push(...items);

    // Sort by pub date (newest first)
    this.sortCache();

    this.lastUpdated = now;
    console.log(`[CacheService] Updated cache with ${items.length} items. Total items: ${this.cache.length}`);
  }

  /**
   * Get all non-expired items from cache, sorted by date
   */
  getItems(): FeedItem[] {
    const now = new Date();
    const expiryMs = config.cache_expiry_days * MILLISECONDS_PER_DAY;

    // Filter out expired items
    this.cache = this.cache.filter(item => {
      const itemAge = now.getTime() - item.pubDate.getTime();
      return itemAge < expiryMs;
    });

    this.sortCache();
    return this.cache;
  }

  /**
   * Get paginated items
   */
  getPaginatedItems(offset: number = 0, limit: number = 20) {
    const items = this.getItems();
    return {
      items: items.slice(offset, offset + limit),
      total: items.length,
      offset,
      limit,
    };
  }

  /**
   * Clear the entire cache
   */
  clearCache(): void {
    this.cache = [];
    this.lastUpdated = new Date(0);
    console.log('[CacheService] Cache cleared');
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const items = this.getItems();
    return {
      totalItems: items.length,
      lastUpdated: this.lastUpdated,
      oldestItem: items.length > 0 ? items[items.length - 1].pubDate : null,
      newestItem: items.length > 0 ? items[0].pubDate : null,
    };
  }

  private sortCache(): void {
    // Sort by pubDate descending (newest first)
    this.cache.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
  }
}

export const cacheService = new CacheService();
