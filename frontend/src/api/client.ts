import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

export interface PaginatedFeedsResponse {
  items: Array<{
    id: string;
    title: string;
    description: string;
    link: string;
    pubDate: string;
    author: string;
    image?: string;
    sourceId: string;
    sourceName: string;
    sourceUrl: string;
    addedAt: string;
  }>;
  total: number;
  offset: number;
  limit: number;
}

export interface Site {
  id: string;
  name: string;
  url: string;
  description?: string;
  image?: string;
  category?: string;
}

export interface SitesResponse {
  items: Site[];
  total: number;
}

export interface CacheStats {
  totalItems: number;
  lastUpdated: string;
  oldestItem?: string;
  newestItem?: string;
}

export const feedsApi = {
  /**
   * Get paginated feed items
   */
  getFeeds(offset: number = 0, limit: number = 20): Promise<PaginatedFeedsResponse> {
    return api.get('/feeds', { params: { offset, limit } }).then(res => res.data);
  },

  /**
   * Get cache statistics
   */
  getStats(): Promise<CacheStats> {
    return api.get('/feeds/stats').then(res => res.data);
  },

  /**
   * Get all sites
   */
  getSites(): Promise<SitesResponse> {
    return api.get('/sites').then(res => res.data);
  },

  /**
   * Get a specific site
   */
  getSite(id: string): Promise<Site> {
    return api.get(`/sites/${id}`).then(res => res.data);
  },
};

export default feedsApi;
