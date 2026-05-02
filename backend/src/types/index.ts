export interface FeedSource {
  id: string;
  name: string;
  url: string;
  feedUrl: string;
  description?: string;
  image?: string;
  category?: string;
}

export interface FeedItem {
  id: string;
  title: string;
  description: string;
  link: string;
  pubDate: Date;
  author: string;
  image?: string;
  sourceId: string;
  sourceName: string;
  sourceUrl: string;
  addedAt: Date;
}

export interface CacheEntry {
  items: FeedItem[];
  lastUpdated: Date;
}

export interface FeedsConfig {
  sources: FeedSource[];
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  offset: number;
  limit: number;
}
