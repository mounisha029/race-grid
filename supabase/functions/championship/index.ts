
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
    const season = parseInt(url.searchParams.get("season") || "2025");
    const type = url.searchParams.get("type") || "drivers";

    console.log(`Fetching ${type} championship for season ${season}`);

    if (type === "drivers") {
      // Get driver championship standings with updated 2025 data
      const { data: championships, error: champError } = await supabaseClient
        .from("championships")
        .select("*")
        .eq("season", season)
        .eq("type", "drivers")
        .order("position");

      if (champError) {
        console.error("Championship query error:", champError);
        throw champError;
      }

      console.log(`Found ${championships?.length || 0} driver championships`);

      // Get driver details for each championship entry with team information
      const standings = [];
      for (const champ of championships || []) {
        const { data: driver, error: driverError } = await supabaseClient
          .from("drivers")
          .select(`
            first_name,
            last_name,
            driver_number,
            nationality,
            profile_image_url,
            team_id,
            teams (
              name,
              primary_color,
              secondary_color
            )
          `)
          .eq("id", champ.entity_id)
          .single();

        if (driverError) {
          console.error("Driver query error:", driverError);
          continue;
        }

        standings.push({
          ...champ,
          drivers: driver
        });
      }

      return new Response(JSON.stringify({ 
        type: "drivers",
        season,
        standings 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } else {
      // Get constructor championship standings with updated 2025 data
      const { data: championships, error: champError } = await supabaseClient
        .from("championships")
        .select("*")
        .eq("season", season)
        .eq("type", "constructors")
        .order("position");

      if (champError) {
        console.error("Championship query error:", champError);
        throw champError;
      }

      console.log(`Found ${championships?.length || 0} constructor championships`);

      // Get team details for each championship entry
      const standings = [];
      for (const champ of championships || []) {
        const { data: team, error: teamError } = await supabaseClient
          .from("teams")
          .select(`
            name,
            full_name,
            primary_color,
            secondary_color,
            logo_url,
            base_location
          `)
          .eq("id", champ.entity_id)
          .single();

        if (teamError) {
          console.error("Team query error:", teamError);
          continue;
        }

        standings.push({
          ...champ,
          teams: team
        });
      }

      return new Response(JSON.stringify({ 
        type: "constructors",
        season,
        standings 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

  } catch (error) {
    console.error("Error in championship function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
