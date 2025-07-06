
interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

class CacheManager {
  private cache = new Map<string, CacheItem<any>>();
  private memoryCache = new Map<string, any>();

  // Set cache with TTL (time to live) in milliseconds
  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      expiry: Date.now() + ttl
    };

    // Store in memory cache
    this.cache.set(key, item);
    
    // Store in localStorage for persistence
    try {
      localStorage.setItem(`cache_${key}`, JSON.stringify(item));
    } catch (error) {
      console.warn('Failed to store in localStorage:', error);
    }
  }

  get<T>(key: string): T | null {
    // Check memory cache first
    let item = this.cache.get(key);
    
    // If not in memory, check localStorage
    if (!item) {
      try {
        const stored = localStorage.getItem(`cache_${key}`);
        if (stored) {
          item = JSON.parse(stored);
          // Restore to memory cache
          if (item) this.cache.set(key, item);
        }
      } catch (error) {
        console.warn('Failed to retrieve from localStorage:', error);
      }
    }

    // Check if item exists and is not expired
    if (item && Date.now() < item.expiry) {
      return item.data;
    }

    // Remove expired item
    if (item) {
      this.delete(key);
    }

    return null;
  }

  delete(key: string): void {
    this.cache.delete(key);
    try {
      localStorage.removeItem(`cache_${key}`);
    } catch (error) {
      console.warn('Failed to remove from localStorage:', error);
    }
  }

  clear(): void {
    this.cache.clear();
    // Clear all cache items from localStorage
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('cache_')) {
        localStorage.removeItem(key);
      }
    });
  }

  // Preload critical data
  async preload(key: string, dataFetcher: () => Promise<any>, ttl?: number): Promise<void> {
    if (!this.get(key)) {
      try {
        const data = await dataFetcher();
        this.set(key, data, ttl);
      } catch (error) {
        console.error('Failed to preload data:', error);
      }
    }
  }

  // Get cache statistics
  getStats() {
    const total = this.cache.size;
    const expired = Array.from(this.cache.values()).filter(
      item => Date.now() >= item.expiry
    ).length;

    return {
      total,
      active: total - expired,
      expired,
      hitRate: this.memoryCache.size / (this.memoryCache.size + 1) // Simplified calculation
    };
  }
}

export const cacheManager = new CacheManager();

// Cache keys constants
export const CACHE_KEYS = {
  DRIVERS: 'drivers',
  TEAMS: 'teams',
  RACES: (season: string) => `races_${season}`,
  CHAMPIONSHIP: (season: string, type: string) => `championship_${season}_${type}`,
  LIVE_RACE: (raceId: string) => `live_race_${raceId}`,
  USER_PREFERENCES: (userId: string) => `user_prefs_${userId}`
} as const;

// TTL constants (in milliseconds)
export const CACHE_TTL = {
  SHORT: 2 * 60 * 1000,      // 2 minutes
  MEDIUM: 15 * 60 * 1000,    // 15 minutes
  LONG: 60 * 60 * 1000,      // 1 hour
  VERY_LONG: 24 * 60 * 60 * 1000  // 24 hours
} as const;
