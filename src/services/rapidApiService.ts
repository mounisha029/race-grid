import { supabase } from "@/integrations/supabase/client";

// Hyprace API interfaces
interface HypraceRace {
  id: string;
  name: string;
  circuit: string;
  location: string;
  country: string;
  date: string;
  time?: string;
  round: number;
  season: number;
  status: string;
  isSprintWeekend?: boolean;
}

interface HypraceDriver {
  id: string;
  firstName: string;
  lastName: string;
  driverNumber: number;
  nationality: string;
  teamId?: string;
  points?: number;
  position?: number;
  wins?: number;
  podiums?: number;
}

interface HypraceTeam {
  id: string;
  name: string;
  fullName: string;
  primaryColor: string;
  secondaryColor: string;
  points?: number;
  position?: number;
  championships?: number;
}

interface HypraceResult {
  id: string;
  position: number;
  driver: HypraceDriver;
  team: HypraceTeam;
  points: number;
  status: string;
  time?: string;
  gap?: string;
}

class RapidApiService {
  private async makeRequest(endpoint: string, params?: Record<string, string>) {
    try {
      const { data, error } = await supabase.functions.invoke('rapidapi-f1', {
        body: { endpoint, params }
      });

      if (error) {
        throw new Error(`Function error: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error(`Failed to fetch from hyprace API: ${endpoint}`, error);
      throw error;
    }
  }

  // Get races for a specific season
  async getSeasonRaces(season: number): Promise<HypraceRace[]> {
    try {
      const data = await this.makeRequest(`/seasons/${season}/grands-prix`);
      return data.races || data.grandsPrix || [];
    } catch (error) {
      console.error(`Failed to fetch races for season ${season}:`, error);
      return [];
    }
  }

  // Get race results for a specific race
  async getRaceResults(season: number, round: number): Promise<HypraceResult[]> {
    try {
      const data = await this.makeRequest(`/seasons/${season}/races/${round}/results`);
      return data.results || [];
    } catch (error) {
      console.error(`Failed to fetch race results for ${season}/${round}:`, error);
      return [];
    }
  }

  // Get drivers for a specific season
  async getSeasonDrivers(season: number): Promise<HypraceDriver[]> {
    try {
      const data = await this.makeRequest(`/seasons/${season}/drivers`);
      return data.drivers || [];
    } catch (error) {
      console.error(`Failed to fetch drivers for season ${season}:`, error);
      return [];
    }
  }

  // Get teams for a specific season
  async getSeasonTeams(season: number): Promise<HypraceTeam[]> {
    try {
      const data = await this.makeRequest(`/seasons/${season}/constructors`);
      return data.constructors || data.teams || [];
    } catch (error) {
      console.error(`Failed to fetch teams for season ${season}:`, error);
      return [];
    }
  }

  // Get driver standings for a specific season
  async getDriverStandings(season: number): Promise<HypraceDriver[]> {
    try {
      const data = await this.makeRequest(`/seasons/${season}/drivers-standings`);
      return data.standings || data.driverStandings || [];
    } catch (error) {
      console.error(`Failed to fetch driver standings for season ${season}:`, error);
      return [];
    }
  }

  // Get team standings for a specific season
  async getTeamStandings(season: number): Promise<HypraceTeam[]> {
    try {
      const data = await this.makeRequest(`/seasons/${season}/constructors-standings`);
      return data.standings || data.constructorStandings || [];
    } catch (error) {
      console.error(`Failed to fetch team standings for season ${season}:`, error);
      return [];
    }
  }

  // Get qualifying results for a specific race
  async getQualifyingResults(season: number, round: number): Promise<HypraceResult[]> {
    try {
      const data = await this.makeRequest(`/seasons/${season}/races/${round}/qualifying`);
      return data.results || [];
    } catch (error) {
      console.error(`Failed to fetch qualifying results for ${season}/${round}:`, error);
      return [];
    }
  }
}

export const rapidApiService = new RapidApiService();
export type { HypraceRace, HypraceDriver, HypraceTeam, HypraceResult };