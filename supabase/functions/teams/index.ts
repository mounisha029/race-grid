
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

    console.log("Fetching teams data");

    // Get all teams
    const { data: teams, error: teamsError } = await supabaseClient
      .from("teams")
      .select("*")
      .order("position");

    if (teamsError) {
      console.error("Teams query error:", teamsError);
      throw teamsError;
    }

    console.log(`Found ${teams?.length || 0} teams`);

    // For each team, add mock driver data since we don't have proper team-driver relationships yet
    const teamsWithDrivers = teams?.map((team, index) => {
      const driverPairs = [
        [{ first_name: "Lewis", last_name: "Hamilton" }, { first_name: "George", last_name: "Russell" }],
        [{ first_name: "Max", last_name: "Verstappen" }, { first_name: "Sergio", last_name: "Pérez" }],
        [{ first_name: "Charles", last_name: "Leclerc" }, { first_name: "Carlos", last_name: "Sainz" }],
        [{ first_name: "Lando", last_name: "Norris" }, { first_name: "Oscar", last_name: "Piastri" }],
        [{ first_name: "Fernando", last_name: "Alonso" }, { first_name: "Lance", last_name: "Stroll" }]
      ];
      
      const drivers = driverPairs[index % driverPairs.length] || [];
      
      return {
        ...team,
        drivers
      };
    }) || [];

    return new Response(JSON.stringify({ 
      teams: teamsWithDrivers 
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
