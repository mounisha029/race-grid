
// API response types for F1 data
export interface DriverStanding {
  id: string;
  position: number;
  points: number;
  wins?: number;
  podiums?: number;
  entity_id: string;
  drivers?: {
    first_name: string;
    last_name: string;
    driver_number: number;
    nationality: string;
    profile_image_url?: string;
    teams?: {
      name: string;
      primary_color: string;
    };
  };
}

export interface ConstructorStanding {
  id: string;
  position: number;
  points: number;
  wins?: number;
  podiums?: number;
  entity_id: string;
  teams?: {
    name: string;
    full_name?: string;
    primary_color: string;
    secondary_color?: string;
    logo_url?: string;
    base_location?: string;
  };
}

export interface ChampionshipResponse {
  type: string;
  season: number;
  standings: DriverStanding[] | ConstructorStanding[];
}

export interface Team {
  id: string;
  name: string;
  full_name?: string;
  primary_color: string;
  secondary_color?: string;
  logo_url?: string;
  base_location?: string;
  drivers?: Array<{
    first_name: string;
    last_name: string;
    driver_number?: number;
  }>;
}

export interface TeamsResponse {
  teams: Team[];
}
