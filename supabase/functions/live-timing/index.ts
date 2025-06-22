
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

interface LiveTimingData {
  raceId: string;
  sessionType: 'practice1' | 'practice2' | 'practice3' | 'sprint_qualifying' | 'qualifying' | 'sprint' | 'race';
  drivers: Array<{
    driverId: string;
    position: number;
    lastLapTime?: string;
    sector1?: string;
    sector2?: string;
    sector3?: string;
    speedTrap?: number;
    tyreCompound?: string;
    tyreAge?: number;
    gapToLeader?: string;
    gapToAhead?: string;
    drsEnabled?: boolean;
    inPit?: boolean;
  }>;
  timestamp: string;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    if (req.method === "POST") {
      // Update live timing data
      const timingData: LiveTimingData = await req.json();
      
      console.log(`Updating live timing for race ${timingData.raceId}, session: ${timingData.sessionType}`);
      
      // Validate the race exists
      const { data: race, error: raceError } = await supabaseClient
        .from('races')
        .select('id')
        .eq('id', timingData.raceId)
        .single();

      if (raceError || !race) {
        throw new Error(`Race ${timingData.raceId} not found`);
      }

      // Update live session data for each driver
      const updates = [];
      for (const driverData of timingData.drivers) {
        const updateData = {
          race_id: timingData.raceId,
          driver_id: driverData.driverId,
          session_type: timingData.sessionType,
          current_position: driverData.position,
          last_lap_time: driverData.lastLapTime || null,
          sector_1_time: driverData.sector1 || null,
          sector_2_time: driverData.sector2 || null,
          sector_3_time: driverData.sector3 || null,
          speed_trap_kmh: driverData.speedTrap || null,
          tyre_compound: driverData.tyreCompound || null,
          tyre_age: driverData.tyreAge || null,
          gap_to_leader: driverData.gapToLeader || null,
          gap_to_ahead: driverData.gapToAhead || null,
          drs_enabled: driverData.drsEnabled || false,
          in_pit: driverData.inPit || false,
          timestamp: new Date().toISOString()
        };

        const { error } = await supabaseClient
          .from('live_session_data')
          .upsert(updateData, {
            onConflict: 'race_id,driver_id,session_type'
          });

        if (error) {
          console.error(`Failed to update live data for driver ${driverData.driverId}:`, error);
        } else {
          updates.push(driverData.driverId);
        }
      }

      return new Response(JSON.stringify({
        success: true,
        message: `Updated live timing for ${updates.length} drivers`,
        updatedDrivers: updates,
        timestamp: new Date().toISOString()
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });

    } else if (req.method === "GET") {
      // Retrieve live timing data
      const url = new URL(req.url);
      const raceId = url.searchParams.get("race_id");
      const sessionType = url.searchParams.get("session_type");

      if (!raceId) {
        throw new Error("Race ID is required");
      }

      let query = supabaseClient
        .from("live_session_data")
        .select(`
          *,
          drivers (
            first_name,
            last_name,
            driver_number
          )
        `)
        .eq("race_id", raceId);

      if (sessionType) {
        query = query.eq("session_type", sessionType);
      }

      const { data: liveData, error } = await query.order("current_position");

      if (error) throw error;

      // Generate mock live timing updates for demo purposes
      const mockUpdates = generateMockTimingUpdates(liveData || []);

      return new Response(JSON.stringify({
        raceId,
        sessionType: sessionType || 'all',
        data: liveData || [],
        mockUpdates, // For demo/testing purposes
        timestamp: new Date().toISOString()
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    return new Response("Method not allowed", {
      status: 405,
      headers: corsHeaders,
    });

  } catch (error) {
    console.error("Error in live timing function:", error);
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

function generateMockTimingUpdates(currentData: any[]): any[] {
  // Generate realistic mock updates for demonstration
  return currentData.map((driver, index) => {
    const baseTime = 90 + Math.random() * 5; // Base lap time around 1:30-1:35
    const variation = (Math.random() - 0.5) * 2; // ±1 second variation
    
    return {
      driverId: driver.driver_id,
      position: index + 1,
      lastLapTime: formatLapTime(baseTime + variation),
      sector1: formatSectorTime(baseTime / 3 + (Math.random() - 0.5) * 0.5),
      sector2: formatSectorTime(baseTime / 3 + (Math.random() - 0.5) * 0.5),
      sector3: formatSectorTime(baseTime / 3 + (Math.random() - 0.5) * 0.5),
      speedTrap: Math.floor(280 + Math.random() * 50), // 280-330 km/h
      tyreCompound: ['soft', 'medium', 'hard', 'intermediate', 'wet'][Math.floor(Math.random() * 5)],
      tyreAge: Math.floor(Math.random() * 50),
      gapToLeader: index === 0 ? null : `+${(Math.random() * 60 + index * 2).toFixed(3)}`,
      gapToAhead: index === 0 ? null : `+${(Math.random() * 5 + 0.5).toFixed(3)}`,
      drsEnabled: Math.random() > 0.7,
      inPit: Math.random() > 0.95
    };
  });
}

function formatLapTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toFixed(3).padStart(6, '0')}`;
}

function formatSectorTime(seconds: number): string {
  return seconds.toFixed(3);
}
