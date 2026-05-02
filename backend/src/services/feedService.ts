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
      const items = await this.extractFeedItems(parsed, source); // ¡Añade el await!

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
 // Añadimos 'async'
  private async extractFeedItems(parsed: any, source: FeedSource): Promise<FeedItem[]> {
    const items: FeedItem[] = [];

    // Handle RSS 2.0
    if (parsed.rss?.channel?.item) {
      const feedItems = Array.isArray(parsed.rss.channel.item)
        ? parsed.rss.channel.item
        : [parsed.rss.channel.item];

      // Cambiamos el forEach por un bucle for...of
      for (const item of feedItems) {
        const feedItem = await this.parseRSSItem(item, source);
        if (feedItem) {
          items.push(feedItem);
        }
      }
    }
    // Handle Atom
    else if (parsed.feed?.entry) {
      const feedItems = Array.isArray(parsed.feed.entry)
        ? parsed.feed.entry
        : [parsed.feed.entry];

      for (const item of feedItems) {
        const feedItem = await this.parseAtomItem(item, source);
        if (feedItem) {
          items.push(feedItem);
        }
      }
    }

    return items;
  }

  /**
   * Parse RSS 2.0 item
   */
  private async parseRSSItem(item: any, source: FeedSource): FeedItem | null {
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
      
      // 1. Buscar en etiquetas directas (Alta prioridad)
      if (item['media:content']) {
        const media = Array.isArray(item['media:content']) ? item['media:content'][0] : item['media:content'];
        image = media['@_url'];
      } else if (item['media:thumbnail']) {
        const thumb = Array.isArray(item['media:thumbnail']) ? item['media:thumbnail'][0] : item['media:thumbnail'];
        image = thumb['@_url'];
      } else if (item['itunes:image']) { 
        // Muchos blogs y podcasts usan el estándar de iTunes
        image = item['itunes:image']['@_href'];
      } else if (item.enclosure) {
        const enc = Array.isArray(item.enclosure) 
          ? item.enclosure.find((e: any) => e['@_type']?.startsWith('image')) || item.enclosure[0]
          : item.enclosure;
        if (enc && enc['@_type']?.startsWith('image')) {
          image = enc['@_url'];
        }
      } 
      
      // 2. Extraer del contenido HTML (Usando el método mejorado)
      if (!image) {
        image = this.extractImageFromHtml(item['content:encoded'], source.url);
      }
      if (!image) {
        image = this.extractImageFromHtml(item.description, source.url);
      }

      // JUSTO ANTES DEL RETURN, AÑADIMOS EL SALVAVIDAS ASÍNCRONO:
      if (!image && link) {
        // Si no hay imagen en el feed, visitamos la web
        image = await this.fetchImageFromUrl(link);
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
      
      // 1. Buscar en etiquetas directas (Alta prioridad)
      if (item['media:content']) {
        const media = Array.isArray(item['media:content']) ? item['media:content'][0] : item['media:content'];
        image = media['@_url'];
      } else if (item['media:thumbnail']) {
        const thumb = Array.isArray(item['media:thumbnail']) ? item['media:thumbnail'][0] : item['media:thumbnail'];
        image = thumb['@_url'];
      } else if (item['itunes:image']) { 
        // Muchos blogs y podcasts usan el estándar de iTunes
        image = item['itunes:image']['@_href'];
      } else if (item.enclosure) {
        const enc = Array.isArray(item.enclosure) 
          ? item.enclosure.find((e: any) => e['@_type']?.startsWith('image')) || item.enclosure[0]
          : item.enclosure;
        if (enc && enc['@_type']?.startsWith('image')) {
          image = enc['@_url'];
        }
      }

      // 2. Extraer del contenido HTML (Usando el método mejorado)
      if (!image) {
        image = this.extractImageFromHtml(item['content:encoded'], source.url);
      }
      if (!image) {
        image = this.extractImageFromHtml(item.description, source.url);
      }
      
      // Try to extract image from content
      if (!image && item.content?.['@_src']) {
        image = item.content['@_src'];
      }
      
      // Try to extract image from summary HTML
      if (!image && (item.summary || item['summary:text'])) {
        const htmlContent = item.summary?.['#text'] || item.summary || '';
        const imgMatch = (htmlContent as string).match(/<img[^>]+src=["']([^"'>]+)["']/);
        image = imgMatch ? imgMatch[1] : undefined;
      }
      
      // Try to extract image from content HTML
      if (!image && item.content?.['#text']) {
        const htmlContent = item.content['#text'] as string;
        const imgMatch = htmlContent.match(/<img[^>]+src=["']([^"'>]+)["']/);
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
   * Extrae la imagen del HTML priorizando la Imagen Destacada de WordPress,
   * ignorando tracking, emojis y controlando objetos de fast-xml-parser.
   */
  private extractImageFromHtml(html: any, baseUrl: string): string | undefined {
    if (!html) return undefined;
    
    // 1. Controlar la "trampa" de fast-xml-parser
    let htmlStr = '';
    if (typeof html === 'string') {
      htmlStr = html;
    } else if (typeof html === 'object' && html['#text']) {
      htmlStr = html['#text'];
    } else {
      htmlStr = String(html);
    }

    const imgRegex = /<img[^>]+>/gi;
    let match;
    let firstValidImage: string | undefined; // Aquí guardaremos la primera por si acaso

    while ((match = imgRegex.exec(htmlStr)) !== null) {
      const imgTag = match[0];

      // 2. Extraer src o data-src
      const srcMatch = imgTag.match(/(?:src|data-src)\s*=\s*["']([^"'>]+)["']/i);
      if (!srcMatch || !srcMatch[1]) continue;
      
      let imageUrl = srcMatch[1];

      // 3. El filtro anti-basura de WordPress
      if (
        imgTag.includes('width="1"') || 
        imgTag.includes('height="1"') || 
        imageUrl.includes('b.gif') || 
        imageUrl.includes('wp-stats') || 
        imageUrl.includes('gravatar.com') || 
        imageUrl.includes('s.w.org/images/core/emoji')
      ) {
        continue; 
      }

      // 4. Arreglar URLs relativas
      if (imageUrl.startsWith('//')) {
        imageUrl = `https:${imageUrl}`;
      } else if (imageUrl.startsWith('/')) {
        try {
          const urlObj = new URL(baseUrl);
          imageUrl = `${urlObj.protocol}//${urlObj.host}${imageUrl}`;
        } catch (e) {}
      }
      
      // 5. PRIORIDAD WORDPRESS: ¿Es la imagen destacada?
      // Comprobamos si tiene las clases CSS típicas de los thumbnails de WP
      const isFeatured = imgTag.includes('wp-post-image') || 
                         imgTag.includes('attachment-') ||
                         imgTag.includes('size-large') ||
                         imgTag.includes('size-full');

      if (isFeatured) {
        // ¡Bingo! Devolvemos esta inmediatamente y dejamos de buscar
        return imageUrl; 
      }

      // Si es una imagen válida pero no parece la destacada, nos la guardamos 
      // por si resulta que el post no tiene imagen destacada configurada.
      if (!firstValidImage) {
        firstValidImage = imageUrl;
      }
    }
    
    // Si terminamos de leer todo el HTML y no había "Imagen Destacada", 
    // devolvemos la primera imagen real que encontramos.
    return firstValidImage;
  }

  /**
   * Visita la URL del artículo y extrae la imagen de las meta-etiquetas (Open Graph / Twitter)
   */
  private async fetchImageFromUrl(url: string): Promise<string | undefined> {
    try {
      // Timeout MUY corto (3 segundos) para no bloquear el proceso si una web es lenta
      const response = await fetch(url, { timeout: 3000 });
      
      if (!response.ok) return undefined;
      
      const html = await response.text();

      // 1. Prioridad Absoluta: Open Graph (og:image) - El estándar de Facebook/WhatsApp
      const ogMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"'>]+)["']/i) || 
                      html.match(/<meta[^>]*content=["']([^"'>]+)["'][^>]*property=["']og:image["']/i);
      if (ogMatch && ogMatch[1]) return ogMatch[1];

      // 2. Segunda opción: Twitter Card (twitter:image)
      const twMatch = html.match(/<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"'>]+)["']/i) ||
                      html.match(/<meta[^>]*content=["']([^"'>]+)["'][^>]*name=["']twitter:image["']/i);
      if (twMatch && twMatch[1]) return twMatch[1];

      // 3. Fallback: Imagen destacada explícita en el HTML de WordPress
      const wpMatch = html.match(/<img[^>]+class=["'][^"']*wp-post-image[^"']*["'][^>]+src=["']([^"'>]+)["']/i);
      if (wpMatch && wpMatch[1]) return wpMatch[1];

      return undefined;
    } catch (error) {
      // Si da error (timeout, bloqueo CORS, 404), simplemente devolvemos undefined
      // No hacemos console.error para no ensuciar el log con webs lentas
      return undefined;
    }
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
