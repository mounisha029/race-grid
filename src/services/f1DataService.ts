import { supabase } from "@/integrations/supabase/client";

interface ErgastResponse {
  MRData: {
    RaceTable?: {
      Races: ErgastRace[];
    };
    DriverTable?: {
      Drivers: ErgastDriver[];
    };
    ConstructorTable?: {
      Constructors: ErgastConstructor[];
    };
    StandingsTable?: {
      StandingsLists: ErgastStandings[];
    };
  };
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
    };
  };
  date: string;
  time?: string;
  Results?: ErgastResult[];
}

interface ErgastDriver {
  driverId: string;
  givenName: string;
  familyName: string;
  nationality: string;
  dateOfBirth?: string;
  permanentNumber?: string;
}

interface ErgastConstructor {
  constructorId: string;
  name: string;
  nationality: string;
}

interface ErgastResult {
  position: string;
  Driver: ErgastDriver;
  Constructor: ErgastConstructor;
  points: string;
  status: string;
  Time?: {
    time: string;
  };
  FastestLap?: {
    Time: {
      time: string;
    };
  };
}

interface ErgastStandings {
  season: string;
  DriverStandings?: Array<{
    position: string;
    points: string;
    wins: string;
    Driver: ErgastDriver;
    Constructors: ErgastConstructor[];
  }>;
  ConstructorStandings?: Array<{
    position: string;
    points: string;
    wins: string;
    Constructor: ErgastConstructor;
  }>;
}

class F1DataService {
  private readonly ERGAST_BASE_URL = 'http://ergast.com/api/f1';
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private cache = new Map<string, { data: any; timestamp: number }>();

  getCurrentYear(): number {
    return new Date().getFullYear();
  }

  async fetchWithFallback<T>(url: string, fallbackData?: T): Promise<T> {
    const cacheKey = url;
    const cached = this.cache.get(cacheKey);
    
    // Return cached data if still valid
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    try {
      console.log(`Fetching data from: ${url}`);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Cache the successful response
      this.cache.set(cacheKey, { data, timestamp: Date.now() });
      
      return data;
    } catch (error) {
      console.error(`Failed to fetch from ${url}:`, error);
      
      // Try fallback to previous year if current year fails
      if (url.includes('/2025/')) {
        const fallbackUrl = url.replace('/2025/', '/2024/');
        console.log(`Trying fallback URL: ${fallbackUrl}`);
        
        try {
          const response = await fetch(fallbackUrl);
          if (response.ok) {
            const data = await response.json();
            this.cache.set(cacheKey, { data, timestamp: Date.now() });
            return data;
          }
        } catch (fallbackError) {
          console.error('Fallback also failed:', fallbackError);
        }
      }
      
      // Return cached data even if expired
      if (cached) {
        console.log('Using expired cached data as fallback');
        return cached.data;
      }
      
      // Return fallback data if provided
      if (fallbackData) {
        console.log('Using provided fallback data');
        return fallbackData;
      }
      
      throw error;
    }
  }

  async syncRaceCalendar(season?: number): Promise<void> {
    const currentYear = this.getCurrentYear();
    const targetSeason = season || currentYear;
    
    try {
      const url = `${this.ERGAST_BASE_URL}/${targetSeason}.json`;
      const response: ErgastResponse = await this.fetchWithFallback(url);
      
      const races = response.MRData.RaceTable?.Races || [];
      
      // Add 2025-specific race data if fetching 2025 season
      if (targetSeason === 2025 && races.length === 0) {
        console.log('Adding 2025 race data manually');
        await this.add2025RaceData();
        return;
      }
      
      for (const race of races) {
        await this.syncRaceData(race, targetSeason);
      }
      
      console.log(`Synced ${races.length} races for season ${targetSeason}`);
    } catch (error) {
      console.error('Failed to sync race calendar:', error);
      throw error;
    }
  }

  private async add2025RaceData(): Promise<void> {
    const races2025 = [
      {
        season: "2025",
        round: "1",
        raceName: "Australian Grand Prix",
        Circuit: {
          circuitId: "albert_park",
          circuitName: "Albert Park Grand Prix Circuit",
          Location: {
            locality: "Melbourne",
            country: "Australia"
          }
        },
        date: "2025-03-16",
        time: "05:00:00Z"
      },
      {
        season: "2025",
        round: "2",
        raceName: "Spanish Grand Prix",
        Circuit: {
          circuitId: "madrid",
          circuitName: "Madrid Street Circuit",
          Location: {
            locality: "Madrid",
            country: "Spain"
          }
        },
        date: "2025-03-30",
        time: "13:00:00Z"
      }
      // Add more 2025 races as needed
    ];

    for (const race of races2025) {
      await this.syncRaceData(race as ErgastRace, 2025);
    }
  }

  private async syncRaceData(ergastRace: ErgastRace, season: number): Promise<void> {
    try {
      // First, ensure circuit exists
      const circuitId = await this.ensureCircuitExists(ergastRace.Circuit);
      
      // Check if race already exists
      const { data: existingRace } = await supabase
        .from('races')
        .select('id')
        .eq('season', season)
        .eq('round', parseInt(ergastRace.round))
        .single();

      const raceData = {
        season,
        round: parseInt(ergastRace.round),
        name: ergastRace.raceName,
        circuit_id: circuitId,
        race_date: ergastRace.date,
        race_time: ergastRace.time || null,
        status: 'scheduled' as const,
        is_sprint_weekend: this.isSprintWeekend(ergastRace.raceName),
        updated_at: new Date().toISOString()
      };

      if (existingRace) {
        // Update existing race
        await supabase
          .from('races')
          .update(raceData)
          .eq('id', existingRace.id);
      } else {
        // Insert new race
        await supabase
          .from('races')
          .insert(raceData);
      }
    } catch (error) {
      console.error(`Failed to sync race data for ${ergastRace.raceName}:`, error);
    }
  }

  private isSprintWeekend(raceName: string): boolean {
    // Define which races have sprint weekends in 2025
    const sprintRaces = [
      'Chinese Grand Prix',
      'Miami Grand Prix', 
      'Austrian Grand Prix',
      'United States Grand Prix',
      'São Paulo Grand Prix',
      'Qatar Grand Prix'
    ];
    return sprintRaces.includes(raceName);
  }

  private async ensureCircuitExists(circuit: ErgastRace['Circuit']): Promise<string> {
    // Check if circuit exists
    const { data: existingCircuit } = await supabase
      .from('circuits')
      .select('id')
      .eq('name', circuit.circuitName)
      .single();

    if (existingCircuit) {
      return existingCircuit.id;
    }

    // Create new circuit
    const { data: newCircuit, error } = await supabase
      .from('circuits')
      .insert({
        name: circuit.circuitName,
        location: circuit.Location.locality,
        country: circuit.Location.country
      })
      .select('id')
      .single();

    if (error) throw error;
    return newCircuit.id;
  }

  async syncDriverStandings(season?: number): Promise<void> {
    const currentYear = this.getCurrentYear();
    const targetSeason = season || currentYear;
    
    try {
      const url = `${this.ERGAST_BASE_URL}/${targetSeason}/driverStandings.json`;
      const response: ErgastResponse = await this.fetchWithFallback(url);
      
      const standings = response.MRData.StandingsTable?.StandingsLists[0]?.DriverStandings || [];
      
      for (const standing of standings) {
        await this.syncDriverStanding(standing, targetSeason);
      }
      
      console.log(`Synced ${standings.length} driver standings for season ${targetSeason}`);
    } catch (error) {
      console.error('Failed to sync driver standings:', error);
      throw error;
    }
  }

  private async syncDriverStanding(standing: any, season: number): Promise<void> {
    try {
      // Ensure driver exists
      const driverId = await this.ensureDriverExists(standing.Driver);
      
      // Upsert championship standing
      const { error } = await supabase
        .from('championships')
        .upsert({
          season,
          type: 'drivers',
          entity_id: driverId,
          position: parseInt(standing.position),
          points: parseInt(standing.points),
          wins: parseInt(standing.wins),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'season,type,entity_id'
        });

      if (error) throw error;
    } catch (error) {
      console.error(`Failed to sync driver standing:`, error);
    }
  }

  private async ensureDriverExists(driver: ErgastDriver): Promise<string> {
    // Check if driver exists
    const { data: existingDriver } = await supabase
      .from('drivers')
      .select('id')
      .eq('first_name', driver.givenName)
      .eq('last_name', driver.familyName)
      .single();

    if (existingDriver) {
      return existingDriver.id;
    }

    // Create new driver
    const { data: newDriver, error } = await supabase
      .from('drivers')
      .insert({
        driver_number: driver.permanentNumber ? parseInt(driver.permanentNumber) : null,
        first_name: driver.givenName,
        last_name: driver.familyName,
        nationality: driver.nationality,
        date_of_birth: driver.dateOfBirth || null
      })
      .select('id')
      .single();

    if (error) throw error;
    return newDriver.id;
  }

  async syncConstructorStandings(season?: number): Promise<void> {
    const currentYear = this.getCurrentYear();
    const targetSeason = season || currentYear;
    
    try {
      const url = `${this.ERGAST_BASE_URL}/${targetSeason}/constructorStandings.json`;
      const response: ErgastResponse = await this.fetchWithFallback(url);
      
      const standings = response.MRData.StandingsTable?.StandingsLists[0]?.ConstructorStandings || [];
      
      for (const standing of standings) {
        await this.syncConstructorStanding(standing, targetSeason);
      }
      
      console.log(`Synced ${standings.length} constructor standings for season ${targetSeason}`);
    } catch (error) {
      console.error('Failed to sync constructor standings:', error);
      throw error;
    }
  }

  private async syncConstructorStanding(standing: any, season: number): Promise<void> {
    try {
      // Ensure team exists
      const teamId = await this.ensureTeamExists(standing.Constructor);
      
      // Upsert championship standing
      const { error } = await supabase
        .from('championships')
        .upsert({
          season,
          type: 'constructors',
          entity_id: teamId,
          position: parseInt(standing.position),
          points: parseInt(standing.points),
          wins: parseInt(standing.wins),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'season,type,entity_id'
        });

      if (error) throw error;
    } catch (error) {
      console.error(`Failed to sync constructor standing:`, error);
    }
  }

  private async ensureTeamExists(constructor: ErgastConstructor): Promise<string> {
    // Check if team exists
    const { data: existingTeam } = await supabase
      .from('teams')
      .select('id')
      .eq('name', constructor.name)
      .single();

    if (existingTeam) {
      return existingTeam.id;
    }

    // Create new team
    const { data: newTeam, error } = await supabase
      .from('teams')
      .insert({
        name: constructor.name,
        full_name: constructor.name,
        base_location: constructor.nationality
      })
      .select('id')
      .single();

    if (error) throw error;
    return newTeam.id;
  }

  async syncRaceResults(season: number, round: number): Promise<void> {
    try {
      const url = `${this.ERGAST_BASE_URL}/${season}/${round}/results.json`;
      const response: ErgastResponse = await this.fetchWithFallback(url);
      
      const race = response.MRData.RaceTable?.Races[0];
      if (!race || !race.Results) {
        console.log(`No results found for season ${season}, round ${round}`);
        return;
      }

      // Get race ID from database
      const { data: raceData } = await supabase
        .from('races')
        .select('id')
        .eq('season', season)
        .eq('round', round)
        .single();

      if (!raceData) {
        console.error(`Race not found in database for season ${season}, round ${round}`);
        return;
      }

      for (const result of race.Results) {
        await this.syncRaceResult(result, raceData.id);
      }

      // Update race status to completed
      await supabase
        .from('races')
        .update({ status: 'completed' })
        .eq('id', raceData.id);

      console.log(`Synced ${race.Results.length} race results for ${race.raceName}`);
    } catch (error) {
      console.error('Failed to sync race results:', error);
      throw error;
    }
  }

  private async syncRaceResult(result: ErgastResult, raceId: string): Promise<void> {
    try {
      const driverId = await this.ensureDriverExists(result.Driver);
      const teamId = await this.ensureTeamExists(result.Constructor);

      const { error } = await supabase
        .from('session_results')
        .upsert({
          race_id: raceId,
          driver_id: driverId,
          team_id: teamId,
          session_type: 'race',
          position: parseInt(result.position),
          final_time: result.Time?.time || null,
          points_awarded: parseInt(result.points),
          status: result.status.toLowerCase().includes('finished') ? 'finished' : 'dnf',
          best_lap_time: result.FastestLap?.Time?.time || null
        }, {
          onConflict: 'race_id,driver_id,session_type'
        });

      if (error) throw error;
    } catch (error) {
      console.error(`Failed to sync race result:`, error);
    }
  }

  clearCache(): void {
    this.cache.clear();
    console.log('Cache cleared');
  }

  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

export const f1DataService = new F1DataService();
