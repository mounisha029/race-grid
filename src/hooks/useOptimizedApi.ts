
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cacheManager, CACHE_KEYS, CACHE_TTL } from "@/utils/cacheManager";

const API_BASE_URL = "https://wcgrdwsndxjkpfgcnbhx.supabase.co/functions/v1";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjZ3Jkd3NuZHhqa3BmZ2NuYmh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2MDU3NDEsImV4cCI6MjA2NjE4MTc0MX0.EDNbLn1UdVAx85xv6Lh0TKGTgZX4vnzp4a-zt9qS3XM";

// Optimized fetch with compression and caching
const optimizedFetch = async (url: string, options: RequestInit = {}) => {
  const cacheKey = `api_${url}`;
  
  // Try cache first for GET requests
  if (!options.method || options.method === 'GET') {
    const cached = cacheManager.get(cacheKey);
    if (cached) {
      return cached;
    }
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'apikey': SUPABASE_ANON_KEY,
      'Accept-Encoding': 'gzip, deflate, br',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  const data = await response.json();
  
  // Cache successful GET responses
  if (!options.method || options.method === 'GET') {
    const ttl = url.includes('live') ? CACHE_TTL.SHORT : CACHE_TTL.MEDIUM;
    cacheManager.set(cacheKey, data, ttl);
  }

  return data;
};

// Generic optimized API hook
export const useOptimizedApiQuery = <T>(
  endpoint: string,
  queryKey: string[],
  params?: Record<string, string>,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    cacheTime?: number;
  }
) => {
  return useQuery({
    queryKey,
    queryFn: async (): Promise<T> => {
      const url = new URL(`${API_BASE_URL}/${endpoint}`);
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          url.searchParams.append(key, value);
        });
      }

      return optimizedFetch(url.toString());
    },
    staleTime: options?.staleTime || 5 * 60 * 1000, // 5 minutes
    gcTime: options?.cacheTime || 10 * 60 * 1000, // 10 minutes
    enabled: options?.enabled,
  });
};

// Optimized hooks for specific data types
export const useOptimizedDrivers = () => {
  return useOptimizedApiQuery("drivers", [CACHE_KEYS.DRIVERS], undefined, {
    staleTime: CACHE_TTL.LONG,
    cacheTime: CACHE_TTL.VERY_LONG
  });
};

export const useOptimizedTeams = () => {
  return useOptimizedApiQuery("teams", [CACHE_KEYS.TEAMS], undefined, {
    staleTime: CACHE_TTL.LONG,
    cacheTime: CACHE_TTL.VERY_LONG
  });
};

export const useOptimizedChampionshipStandings = (season?: string, type?: string) => {
  const currentYear = new Date().getFullYear();
  const targetSeason = season || currentYear.toString();
  
  const params: Record<string, string> = { season: targetSeason };
  if (type) params.type = type;
  
  return useOptimizedApiQuery(
    "championship", 
    [CACHE_KEYS.CHAMPIONSHIP(targetSeason, type || "drivers")], 
    params,
    {
      staleTime: CACHE_TTL.MEDIUM,
      cacheTime: CACHE_TTL.LONG
    }
  );
};

export const useOptimizedRaceCalendar = (season?: string, status?: string) => {
  const currentYear = new Date().getFullYear();
  const targetSeason = season || currentYear.toString();
  
  const params: Record<string, string> = { season: targetSeason };
  if (status) params.status = status;
  
  return useOptimizedApiQuery(
    "races", 
    [CACHE_KEYS.RACES(targetSeason), status || "all"], 
    params,
    {
      staleTime: CACHE_TTL.MEDIUM,
      cacheTime: CACHE_TTL.LONG
    }
  );
};

// Background prefetching for critical data
export const usePrefetchCriticalData = () => {
  const queryClient = useQueryClient();

  const prefetchData = async () => {
    const currentYear = new Date().getFullYear().toString();
    
    // Prefetch critical data in background
    Promise.all([
      queryClient.prefetchQuery({
        queryKey: [CACHE_KEYS.DRIVERS],
        queryFn: () => optimizedFetch(`${API_BASE_URL}/drivers`),
        staleTime: CACHE_TTL.LONG,
      }),
      queryClient.prefetchQuery({
        queryKey: [CACHE_KEYS.TEAMS],
        queryFn: () => optimizedFetch(`${API_BASE_URL}/teams`),
        staleTime: CACHE_TTL.LONG,
      }),
      queryClient.prefetchQuery({
        queryKey: [CACHE_KEYS.CHAMPIONSHIP(currentYear, "drivers")],
        queryFn: () => optimizedFetch(`${API_BASE_URL}/championship?season=${currentYear}&type=drivers`),
        staleTime: CACHE_TTL.MEDIUM,
      }),
    ]).catch(error => {
      console.warn('Background prefetch failed:', error);
    });
  };

  return { prefetchData };
};
