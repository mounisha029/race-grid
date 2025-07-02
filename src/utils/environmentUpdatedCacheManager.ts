
import { config } from '@/config/environment';
import { logger } from './logger';

class EnvironmentAwareCacheManager {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  
  set(key: string, data: any, customTtl?: number): void {
    const ttl = customTtl || config.CACHE_TTL.MEDIUM;
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
    
    logger.debug(`Cache set: ${key} (TTL: ${ttl}ms)`);
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    
    if (!item) {
      logger.debug(`Cache miss: ${key}`);
      return null;
    }

    const now = Date.now();
    const isExpired = now - item.timestamp > item.ttl;

    if (isExpired) {
      this.cache.delete(key);
      logger.debug(`Cache expired: ${key}`);
      return null;
    }

    logger.debug(`Cache hit: ${key}`);
    return item.data;
  }

  clear(): void {
    this.cache.clear();
    logger.info('Cache cleared');
  }

  // Environment-specific cache behavior
  setWithEnvironmentTtl(key: string, data: any, cacheType: keyof typeof config.CACHE_TTL): void {
    const ttl = config.CACHE_TTL[cacheType];
    this.set(key, data, ttl);
  }

  // Get cache statistics
  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

export const envCacheManager = new EnvironmentAwareCacheManager();
