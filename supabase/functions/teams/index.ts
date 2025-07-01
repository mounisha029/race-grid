
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

    console.log("Fetching teams data with correct 2025 driver lineups");

    // Get all teams with their actual drivers
    const { data: teams, error: teamsError } = await supabaseClient
      .from("teams")
      .select(`
        *,
        drivers (
          id,
          first_name,
          last_name,
          driver_number,
          nationality,
          profile_image_url,
          points,
          position,
          wins,
          podiums
        )
      `)
      .eq("is_active", true)
      .order("position");

    if (teamsError) {
      console.error("Teams query error:", teamsError);
      throw teamsError;
    }

    console.log(`Found ${teams?.length || 0} teams with their actual drivers`);

    return new Response(JSON.stringify({ 
      teams: teams || []
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Error in teams function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
