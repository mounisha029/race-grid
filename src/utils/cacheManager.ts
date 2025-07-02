
import { config } from '@/config/environment';
import { logger } from './logger';

// Update cache keys to be environment-aware
export const CACHE_KEYS = {
  DRIVERS: `drivers_${config.NODE_ENV}`,
  TEAMS: `teams_${config.NODE_ENV}`,
  RACES: (season: string) => `races_${season}_${config.NODE_ENV}`,
  CHAMPIONSHIP: (season: string, type: string) => `championship_${season}_${type}_${config.NODE_ENV}`,
  LIVE_DATA: (raceId: string) => `live_${raceId}_${config.NODE_ENV}`,
} as const;

// Use environment-specific TTL values
export const CACHE_TTL = config.CACHE_TTL;

class CacheManager {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  
  set(key: string, data: any, ttl: number = CACHE_TTL.MEDIUM): void {
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

  // Environment-specific methods
  setShortTerm(key: string, data: any): void {
    this.set(key, data, CACHE_TTL.SHORT);
  }

  setMediumTerm(key: string, data: any): void {
    this.set(key, data, CACHE_TTL.MEDIUM);
  }

  setLongTerm(key: string, data: any): void {
    this.set(key, data, CACHE_TTL.LONG);
  }

  setVeryLongTerm(key: string, data: any): void {
    this.set(key, data, CACHE_TTL.VERY_LONG);
  }

  // Get cache statistics for monitoring
  getStats(): { size: number; keys: string[]; environment: string } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      environment: config.NODE_ENV
    };
  }
}

export const cacheManager = new CacheManager();
