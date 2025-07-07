
interface ErgastResponse<T> {
  MRData: T;
}

interface ErgastRaceTable {
  Races: ErgastRace[];
}

interface ErgastDriverTable {
  Drivers: ErgastDriver[];
}

interface ErgastConstructorTable {
  Constructors: ErgastConstructor[];
}

interface ErgastStandingsTable {
  StandingsLists: ErgastStandings[];
}

interface ErgastRace {
  season: string;
  round: string;
  raceName: string;
  Circuit: {
    circuitId: string;
    circuitName: string;
    Location: {
      locality: string;
      country: string;
      lat?: string;
      long?: string;
    };
  };
  date: string;
  time?: string;
  Results?: ErgastResult[];
}

interface ErgastDriver {
  driverId: string;
  permanentNumber?: string;
  code?: string;
  givenName: string;
  familyName: string;
  dateOfBirth?: string;
  nationality: string;
}

interface ErgastConstructor {
  constructorId: string;
  name: string;
  nationality: string;
}

interface ErgastResult {
  number: string;
  position: string;
  positionText: string;
  points: string;
  Driver: ErgastDriver;
  Constructor: ErgastConstructor;
  grid: string;
  laps: string;
  status: string;
  Time?: {
    millis: string;
    time: string;
  };
  FastestLap?: {
    rank: string;
    lap: string;
    Time: {
      time: string;
    };
    AverageSpeed: {
      units: string;
      speed: string;
    };
  };
}

interface ErgastStandings {
  season: string;
  round?: string;
  DriverStandings?: Array<{
    position: string;
    positionText: string;
    points: string;
    wins: string;
    Driver: ErgastDriver;
    Constructors: ErgastConstructor[];
  }>;
  ConstructorStandings?: Array<{
    position: string;
    positionText: string;
    points: string;
    wins: string;
    Constructor: ErgastConstructor;
  }>;
}

class ErgastApiService {
  private readonly BASE_URL = 'http://ergast.com/api/f1';
  private readonly cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

  private async fetchWithCache<T>(url: string): Promise<T> {
    const cacheKey = url;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    try {
      console.log(`Fetching from Ergast API: ${url}`);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      this.cache.set(cacheKey, { data, timestamp: Date.now() });
      return data;
    } catch (error) {
      console.error(`Failed to fetch from Ergast API: ${url}`, error);
      
      // Return cached data if available, even if expired
      if (cached) {
        console.log('Using expired cached data as fallback');
        return cached.data;
      }
      
      throw error;
    }
  }

  // Get current season races
  async getCurrentSeasonRaces(): Promise<ErgastRace[]> {
    const currentYear = new Date().getFullYear();
    const url = `${this.BASE_URL}/${currentYear}.json`;
    
    try {
      const response: ErgastResponse<ErgastRaceTable> = await this.fetchWithCache(url);
      return response.MRData.Races || [];
    } catch (error) {
      console.error('Failed to fetch current season races:', error);
      return [];
    }
  }

  // Get races for a specific season
  async getSeasonRaces(season: number): Promise<ErgastRace[]> {
    const url = `${this.BASE_URL}/${season}.json`;
    
    try {
      const response: ErgastResponse<ErgastRaceTable> = await this.fetchWithCache(url);
      return response.MRData.Races || [];
    } catch (error) {
      console.error(`Failed to fetch races for season ${season}:`, error);
      return [];
    }
  }

  // Get race results for a specific race
  async getRaceResults(season: number, round: number): Promise<ErgastResult[]> {
    const url = `${this.BASE_URL}/${season}/${round}/results.json`;
    
    try {
      const response: ErgastResponse<ErgastRaceTable> = await this.fetchWithCache(url);
      const race = response.MRData.Races?.[0];
      return race?.Results || [];
    } catch (error) {
      console.error(`Failed to fetch race results for ${season}/${round}:`, error);
      return [];
    }
  }

  // Get current driver standings
  async getCurrentDriverStandings(): Promise<ErgastStandings[]> {
    const currentYear = new Date().getFullYear();
    const url = `${this.BASE_URL}/${currentYear}/driverStandings.json`;
    
    try {
      const response: ErgastResponse<ErgastStandingsTable> = await this.fetchWithCache(url);
      return response.MRData.StandingsLists || [];
    } catch (error) {
      console.error('Failed to fetch current driver standings:', error);
      return [];
    }
  }

  // Get driver standings for a specific season
  async getDriverStandings(season: number): Promise<ErgastStandings[]> {
    const url = `${this.BASE_URL}/${season}/driverStandings.json`;
    
    try {
      const response: ErgastResponse<ErgastStandingsTable> = await this.fetchWithCache(url);
      return response.MRData.StandingsLists || [];
    } catch (error) {
      console.error(`Failed to fetch driver standings for season ${season}:`, error);
      return [];
    }
  }

  // Get current constructor standings
  async getCurrentConstructorStandings(): Promise<ErgastStandings[]> {
    const currentYear = new Date().getFullYear();
    const url = `${this.BASE_URL}/${currentYear}/constructorStandings.json`;
    
    try {
      const response: ErgastResponse<ErgastStandingsTable> = await this.fetchWithCache(url);
      return response.MRData.StandingsLists || [];
    } catch (error) {
      console.error('Failed to fetch current constructor standings:', error);
      return [];
    }
  }

  // Get constructor standings for a specific season
  async getConstructorStandings(season: number): Promise<ErgastStandings[]> {
    const url = `${this.BASE_URL}/${season}/constructorStandings.json`;
    
    try {
      const response: ErgastResponse<ErgastStandingsTable> = await this.fetchWithCache(url);
      return response.MRData.StandingsLists || [];
    } catch (error) {
      console.error(`Failed to fetch constructor standings for season ${season}:`, error);
      return [];
    }
  }

  // Get all drivers for a season
  async getSeasonDrivers(season: number): Promise<ErgastDriver[]> {
    const url = `${this.BASE_URL}/${season}/drivers.json`;
    
    try {
      const response: ErgastResponse<ErgastDriverTable> = await this.fetchWithCache(url);
      return response.MRData.Drivers || [];
    } catch (error) {
      console.error(`Failed to fetch drivers for season ${season}:`, error);
      return [];
    }
  }

  // Get all constructors for a season
  async getSeasonConstructors(season: number): Promise<ErgastConstructor[]> {
    const url = `${this.BASE_URL}/${season}/constructors.json`;
    
    try {
      const response: ErgastResponse<ErgastConstructorTable> = await this.fetchWithCache(url);
      return response.MRData.Constructors || [];
    } catch (error) {
      console.error(`Failed to fetch constructors for season ${season}:`, error);
      return [];
    }
  }

  // Get qualifying results for a specific race
  async getQualifyingResults(season: number, round: number): Promise<ErgastResult[]> {
    const url = `${this.BASE_URL}/${season}/${round}/qualifying.json`;
    
    try {
      const response: ErgastResponse<ErgastRaceTable> = await this.fetchWithCache(url);
      const race = response.MRData.Races?.[0];
      return race?.Results || [];
    } catch (error) {
      console.error(`Failed to fetch qualifying results for ${season}/${round}:`, error);
      return [];
    }
  }

  // Get lap times for a specific race
  async getLapTimes(season: number, round: number, lap?: number): Promise<any[]> {
    const lapQuery = lap ? `/${lap}` : '';
    const url = `${this.BASE_URL}/${season}/${round}/laps${lapQuery}.json`;
    
    try {
      const response = await this.fetchWithCache(url);
      return response.MRData?.Laps || [];
    } catch (error) {
      console.error(`Failed to fetch lap times for ${season}/${round}:`, error);
      return [];
    }
  }

  // Get pit stop data for a specific race
  async getPitStops(season: number, round: number): Promise<any[]> {
    const url = `${this.BASE_URL}/${season}/${round}/pitstops.json`;
    
    try {
      const response = await this.fetchWithCache(url);
      return response.MRData?.PitStops || [];
    } catch (error) {
      console.error(`Failed to fetch pit stops for ${season}/${round}:`, error);
      return [];
    }
  }

  // Clear cache
  clearCache(): void {
    this.cache.clear();
    console.log('Ergast API cache cleared');
  }

  // Get cache statistics
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

export const ergastApiService = new ErgastApiService();
export type { ErgastRace, ErgastDriver, ErgastConstructor, ErgastResult, ErgastStandings };
