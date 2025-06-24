import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface SyncRequest {
  type: 'races' | 'drivers' | 'constructors' | 'results';
  season?: number;
  round?: number;
  force?: boolean;
}

interface ErgastResponse {
  MRData: {
    RaceTable?: {
      Races: any[];
    };
    DriverTable?: {
      Drivers: any[];
    };
    ConstructorTable?: {
      Constructors: any[];
    };
    StandingsTable?: {
      StandingsLists: any[];
    };
  };
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", {
      status: 405,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const syncData: SyncRequest = await req.json();
    const currentSeason = new Date().getFullYear();
    const season = syncData.season || currentSeason;

    console.log(`Starting data sync for type: ${syncData.type}, season: ${season}`);

    switch (syncData.type) {
      case 'races':
        await syncRaces(supabaseClient, season, syncData.force);
        break;
      case 'drivers':
        await syncDriverStandings(supabaseClient, season, syncData.force);
        break;
      case 'constructors':
        await syncConstructorStandings(supabaseClient, season, syncData.force);
        break;
      case 'results':
        if (!syncData.round) {
          throw new Error("Round number required for results sync");
        }
        await syncRaceResults(supabaseClient, season, syncData.round, syncData.force);
        break;
      default:
        throw new Error(`Unknown sync type: ${syncData.type}`);
    }

    return new Response(JSON.stringify({
      success: true,
      message: `Successfully synced ${syncData.type} for season ${season}`,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Error in data sync:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

async function fetchErgastData(url: string): Promise<ErgastResponse> {
  console.log(`Fetching: ${url}`);
  const response = await fetch(url);
  
  if (!response.ok) {
    // If 2025 data fails, try 2024 fallback
    if (url.includes('/2025/')) {
      const fallbackUrl = url.replace('/2025/', '/2024/');
      console.log(`2025 data failed, trying fallback: ${fallbackUrl}`);
      
      const fallbackResponse = await fetch(fallbackUrl);
      if (fallbackResponse.ok) {
        return await fallbackResponse.json();
      }
    }
    throw new Error(`Ergast API error: ${response.status} ${response.statusText}`);
  }
  
  return await response.json();
}

async function syncRaces(supabaseClient: any, season: number, force: boolean = false) {
  const url = `http://ergast.com/api/f1/${season}.json`;
  
  try {
    const data = await fetchErgastData(url);
    const races = data.MRData.RaceTable?.Races || [];
    
    // If no races and it's 2025, add manual 2025 data
    if (races.length === 0 && season === 2025) {
      console.log("Adding 2025 race data manually");
      await add2025RaceData(supabaseClient);
      return;
    }
    
    let syncedCount = 0;
    
    for (const race of races) {
      try {
        // Check if race already exists
        const { data: existingRace } = await supabaseClient
          .from('races')
          .select('id, updated_at')
          .eq('season', season)
          .eq('round', parseInt(race.round))
          .single();

        if (existingRace && !force) {
          console.log(`Race ${race.raceName} already exists, skipping`);
          continue;
        }

        // Ensure circuit exists
        const circuitId = await ensureCircuitExists(supabaseClient, race.Circuit);
        
        const raceData = {
          season,
          round: parseInt(race.round),
          name: race.raceName,
          circuit_id: circuitId,
          race_date: race.date,
          race_time: race.time || null,
          status: 'scheduled',
          is_sprint_weekend: isSprintWeekend(race.raceName),
          updated_at: new Date().toISOString()
        };

        if (existingRace) {
          await supabaseClient
            .from('races')
            .update(raceData)
            .eq('id', existingRace.id);
        } else {
          await supabaseClient
            .from('races')
            .insert(raceData);
        }
        
        syncedCount++;
      } catch (error) {
        console.error(`Failed to sync race ${race.raceName}:`, error);
      }
    }
    
    console.log(`Synced ${syncedCount} races for season ${season}`);
  } catch (error) {
    console.error(`Failed to sync races for season ${season}:`, error);
    throw error;
  }
}

function isSprintWeekend(raceName: string): boolean {
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

async function add2025RaceData(supabaseClient: any) {
  const races2025 = [
    {
      season: 2025,
      round: 1,
      name: "Australian Grand Prix",
      race_date: "2025-03-16",
      race_time: "05:00:00",
      status: 'scheduled',
      is_sprint_weekend: false,
      circuit: {
        name: "Albert Park Grand Prix Circuit",
        location: "Melbourne",
        country: "Australia"
      }
    },
    {
      season: 2025,
      round: 2,
      name: "Spanish Grand Prix",
      race_date: "2025-03-30",
      race_time: "13:00:00",
      status: 'scheduled',
      is_sprint_weekend: false,
      circuit: {
        name: "Madrid Street Circuit",
        location: "Madrid",
        country: "Spain"
      }
    }
  ];

  for (const race of races2025) {
    try {
      // Ensure circuit exists
      const { data: existingCircuit } = await supabaseClient
        .from('circuits')
        .select('id')
        .eq('name', race.circuit.name)
        .single();

      let circuitId;
      if (existingCircuit) {
        circuitId = existingCircuit.id;
      } else {
        const { data: newCircuit, error } = await supabaseClient
          .from('circuits')
          .insert({
            name: race.circuit.name,
            location: race.circuit.location,
            country: race.circuit.country
          })
          .select('id')
          .single();

        if (error) throw error;
        circuitId = newCircuit.id;
      }

      // Insert race
      await supabaseClient
        .from('races')
        .insert({
          season: race.season,
          round: race.round,
          name: race.name,
          circuit_id: circuitId,
          race_date: race.race_date,
          race_time: race.race_time,
          status: race.status,
          is_sprint_weekend: race.is_sprint_weekend,
          updated_at: new Date().toISOString()
        });

      console.log(`Added 2025 race: ${race.name}`);
    } catch (error) {
      console.error(`Failed to add 2025 race ${race.name}:`, error);
    }
  }
}

async function syncDriverStandings(supabaseClient: any, season: number, force: boolean = false) {
  const url = `http://ergast.com/api/f1/${season}/driverStandings.json`;
  const data = await fetchErgastData(url);
  
  const standings = data.MRData.StandingsTable?.StandingsLists[0]?.DriverStandings || [];
  let syncedCount = 0;
  
  for (const standing of standings) {
    try {
      const driverId = await ensureDriverExists(supabaseClient, standing.Driver);
      
      const { error } = await supabaseClient
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
      syncedCount++;
    } catch (error) {
      console.error(`Failed to sync driver standing:`, error);
    }
  }
  
  console.log(`Synced ${syncedCount} driver standings for season ${season}`);
}

async function syncConstructorStandings(supabaseClient: any, season: number, force: boolean = false) {
  const url = `http://ergast.com/api/f1/${season}/constructorStandings.json`;
  const data = await fetchErgastData(url);
  
  const standings = data.MRData.StandingsTable?.StandingsLists[0]?.ConstructorStandings || [];
  let syncedCount = 0;
  
  for (const standing of standings) {
    try {
      const teamId = await ensureTeamExists(supabaseClient, standing.Constructor);
      
      const { error } = await supabaseClient
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
      syncedCount++;
    } catch (error) {
      console.error(`Failed to sync constructor standing:`, error);
    }
  }
  
  console.log(`Synced ${syncedCount} constructor standings for season ${season}`);
}

async function syncRaceResults(supabaseClient: any, season: number, round: number, force: boolean = false) {
  const url = `http://ergast.com/api/f1/${season}/${round}/results.json`;
  const data = await fetchErgastData(url);
  
  const race = data.MRData.RaceTable?.Races[0];
  if (!race || !race.Results) {
    throw new Error(`No results found for season ${season}, round ${round}`);
  }

  // Get race ID
  const { data: raceData } = await supabaseClient
    .from('races')
    .select('id')
    .eq('season', season)
    .eq('round', round)
    .single();

  if (!raceData) {
    throw new Error(`Race not found for season ${season}, round ${round}`);
  }

  let syncedCount = 0;
  
  for (const result of race.Results) {
    try {
      const driverId = await ensureDriverExists(supabaseClient, result.Driver);
      const teamId = await ensureTeamExists(supabaseClient, result.Constructor);

      const { error } = await supabaseClient
        .from('session_results')
        .upsert({
          race_id: raceData.id,
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
      syncedCount++;
    } catch (error) {
      console.error(`Failed to sync race result:`, error);
    }
  }

  // Update race status
  await supabaseClient
    .from('races')
    .update({ status: 'completed' })
    .eq('id', raceData.id);
    
  console.log(`Synced ${syncedCount} race results for ${race.raceName}`);
}

async function ensureCircuitExists(supabaseClient: any, circuit: any): Promise<string> {
  const { data: existing } = await supabaseClient
    .from('circuits')
    .select('id')
    .eq('name', circuit.circuitName)
    .single();

  if (existing) return existing.id;

  const { data: newCircuit, error } = await supabaseClient
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

async function ensureDriverExists(supabaseClient: any, driver: any): Promise<string> {
  const { data: existing } = await supabaseClient
    .from('drivers')
    .select('id')
    .eq('first_name', driver.givenName)
    .eq('last_name', driver.familyName)
    .single();

  if (existing) return existing.id;

  const { data: newDriver, error } = await supabaseClient
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

async function ensureTeamExists(supabaseClient: any, constructor: any): Promise<string> {
  const { data: existing } = await supabaseClient
    .from('teams')
    .select('id')
    .eq('name', constructor.name)
    .single();

  if (existing) return existing.id;

  const { data: newTeam, error } = await supabaseClient
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
