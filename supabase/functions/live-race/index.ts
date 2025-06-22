
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const url = new URL(req.url);
    const raceId = url.searchParams.get("race_id");

    if (!raceId) {
      throw new Error("Race ID is required");
    }

    // Get live session data
    const { data: liveData, error: liveError } = await supabaseClient
      .from("live_session_data")
      .select(`
        *,
        drivers (
          first_name,
          last_name,
          driver_number
        ),
        races (
          name,
          status,
          round
        )
      `)
      .eq("race_id", raceId)
      .order("current_position");

    if (liveError) throw liveError;

    // Get latest lap times
    const { data: lapTimes, error: lapError } = await supabaseClient
      .from("lap_times")
      .select(`
        *,
        drivers (
          first_name,
          last_name,
          driver_number
        )
      `)
      .eq("race_id", raceId)
      .order("lap_number", { ascending: false })
      .limit(20);

    if (lapError) throw lapError;

    // Get race information
    const { data: race, error: raceError } = await supabaseClient
      .from("races")
      .select(`
        *,
        circuits (
          name,
          location,
          country
        )
      `)
      .eq("id", raceId)
      .single();

    if (raceError) throw raceError;

    return new Response(JSON.stringify({
      race,
      liveData,
      recentLapTimes: lapTimes,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Error in live-race function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
