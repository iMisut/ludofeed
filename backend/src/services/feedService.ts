import fetch from 'node-fetch';
import { XMLParser } from 'fast-xml-parser';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from '../config.js';
import { FeedSource, FeedItem, FeedsConfig } from '../types/index.js';
import { cacheService } from './cacheService.js';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class FeedService {
  private feedSources: FeedSource[] = [];
  private feedCheckTimeout: NodeJS.Timeout | null = null;

  /**
   * Initialize feed sources from local feeds.json
   */
  async initialize(): Promise<void> {
    try {
      console.log('[FeedService] Initializing feeds from local feeds.json');
      
      const feedsPath = join(__dirname, '../../feeds.json');
      const feedsData = readFileSync(feedsPath, 'utf-8');
      const data = JSON.parse(feedsData) as FeedsConfig;
      
      this.feedSources = data.sources || [];

      console.log(`[FeedService] Loaded ${this.feedSources.length} feed sources`);

      // Initial fetch of all feeds
      await this.fetchAllFeeds();

      // Schedule periodic updates
      this.scheduleFeedChecks();
    } catch (error) {
      console.error('[FeedService] Failed to initialize:', error);
      throw error;
    }
  }

  /**
   * Fetch all feeds and update cache
   */
  async fetchAllFeeds(): Promise<void> {
    console.log('[FeedService] Fetching all feeds...');
    const allItems: FeedItem[] = [];

    for (const source of this.feedSources) {
      try {
        const items = await this.fetchFeed(source);
        allItems.push(...items);
      } catch (error) {
        console.error(`[FeedService] Error fetching feed from ${source.name}:`, error);
      }
    }

    if (allItems.length > 0) {
      cacheService.addItems(allItems);
    }

    console.log(`[FeedService] Finished fetching all feeds. Total new items: ${allItems.length}`);
  }

  /**
   * Fetch a single feed from a source
   */
  private async fetchFeed(source: FeedSource): Promise<FeedItem[]> {
    try {
      const response = await fetch(source.feedUrl, {
        timeout: 10000, // 10 second timeout
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const xmlText = await response.text();
      const parser = new XMLParser({
        ignoreAttributes: false,
        parseTagValue: true,
      });

      const parsed = parser.parse(xmlText);
      const items = this.extractFeedItems(parsed, source);

      console.log(`[FeedService] Fetched ${items.length} items from ${source.name}`);
      return items;
    } catch (error) {
      console.error(`[FeedService] Error fetching ${source.feedUrl}:`, error);
      return [];
    }
  }

  /**
   * Parse feed XML and extract items
   */
  private extractFeedItems(parsed: any, source: FeedSource): FeedItem[] {
    const items: FeedItem[] = [];

    // Handle RSS 2.0
    if (parsed.rss?.channel?.item) {
      const feedItems = Array.isArray(parsed.rss.channel.item)
        ? parsed.rss.channel.item
        : [parsed.rss.channel.item];

      feedItems.forEach((item: any) => {
        const feedItem = this.parseRSSItem(item, source);
        if (feedItem) {
          items.push(feedItem);
        }
      });
    }
    // Handle Atom
    else if (parsed.feed?.entry) {
      const feedItems = Array.isArray(parsed.feed.entry)
        ? parsed.feed.entry
        : [parsed.feed.entry];

      feedItems.forEach((item: any) => {
        const feedItem = this.parseAtomItem(item, source);
        if (feedItem) {
          items.push(feedItem);
        }
      });
    }

    return items;
  }

  /**
   * Parse RSS 2.0 item
   */
  private parseRSSItem(item: any, source: FeedSource): FeedItem | null {
    try {
      const title = item.title || '';
      const link = item.link || '';
      const pubDate = new Date(item.pubDate || new Date());
      const description = item.description || '';
      const author = item.author || item['dc:creator'] || source.name;

      // Generate unique ID based on link and source
      const id = crypto
        .createHash('md5')
        .update(`${source.id}-${link}`)
        .digest('hex');

      let image: string | undefined;
      if (item['media:content']) {
        image = item['media:content']['@_url'];
      } else if (item['content:encoded']) {
        // Try to extract image from content
        const imgMatch = (item['content:encoded'] as string).match(/<img[^>]+src="([^">]+)"/);
        image = imgMatch ? imgMatch[1] : undefined;
      }

      return {
        id,
        title,
        description: this.stripHTML(description),
        link,
        pubDate,
        author,
        image,
        sourceId: source.id,
        sourceName: source.name,
        sourceUrl: source.url,
        addedAt: new Date(),
      };
    } catch (error) {
      console.error('[FeedService] Error parsing RSS item:', error);
      return null;
    }
  }

  /**
   * Parse Atom item
   */
  private parseAtomItem(item: any, source: FeedSource): FeedItem | null {
    try {
      const title = item.title?.['#text'] || item.title || '';
      const link = item.link?.['@_href'] || item.link || '';
      const pubDate = new Date(item.published || item.updated || new Date());
      const description = item.summary?.['#text'] || item.summary || '';
      const author =
        item.author?.name?.['#text'] || item.author?.name || item.author || source.name;

      // Generate unique ID
      const id = crypto
        .createHash('md5')
        .update(`${source.id}-${link}`)
        .digest('hex');

      let image: string | undefined;
      if (Array.isArray(item.link)) {
        const imgLink = item.link.find(
          (l: any) => l['@_rel'] === 'enclosure' || l['@_type']?.startsWith('image'),
        );
        if (imgLink) {
          image = imgLink['@_href'];
        }
      }

      return {
        id,
        title,
        description: this.stripHTML(description),
        link,
        pubDate,
        author,
        image,
        sourceId: source.id,
        sourceName: source.name,
        sourceUrl: source.url,
        addedAt: new Date(),
      };
    } catch (error) {
      console.error('[FeedService] Error parsing Atom item:', error);
      return null;
    }
  }

  /**
   * Remove HTML tags from text
   */
  private stripHTML(html: string): string {
    return html.replace(/<[^>]*>/g, '').trim();
  }

  /**
   * Schedule periodic feed checks
   */
  private scheduleFeedChecks(): void {
    const intervalMs = config.feed_check_interval_minutes * 60 * 1000;

    this.feedCheckTimeout = setInterval(async () => {
      console.log('[FeedService] Running scheduled feed check');
      await this.fetchAllFeeds();
    }, intervalMs);

    console.log(
      `[FeedService] Scheduled feed checks every ${config.feed_check_interval_minutes} minutes`,
    );
  }

  /**
   * Stop scheduled feed checks
   */
  stopSchedule(): void {
    if (this.feedCheckTimeout) {
      clearInterval(this.feedCheckTimeout);
      this.feedCheckTimeout = null;
      console.log('[FeedService] Feed checks stopped');
    }
  }

  /**
   * Get all feed sources
   */
  getSources(): FeedSource[] {
    return this.feedSources;
  }

  /**
   * Get a specific feed source by ID
   */
  getSource(id: string): FeedSource | undefined {
    return this.feedSources.find(source => source.id === id);
  }
}

export const feedService = new FeedService();
