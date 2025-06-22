
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
    const season = parseInt(url.searchParams.get("season") || "2024");
    const type = url.searchParams.get("type") || "drivers";

    if (type === "drivers") {
      // Get driver championship standings
      const { data: standings, error } = await supabaseClient
        .from("championships")
        .select(`
          *,
          drivers (
            first_name,
            last_name,
            driver_number,
            nationality,
            profile_image_url,
            teams (
              name,
              primary_color
            )
          )
        `)
        .eq("season", season)
        .eq("type", "drivers")
        .order("position");

      if (error) throw error;

      return new Response(JSON.stringify({ 
        type: "drivers",
        season,
        standings 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } else {
      // Get constructor championship standings
      const { data: standings, error } = await supabaseClient
        .from("championships")
        .select(`
          *,
          teams (
            name,
            full_name,
            primary_color,
            secondary_color,
            logo_url,
            base_location
          )
        `)
        .eq("season", season)
        .eq("type", "constructors")
        .order("position");

      if (error) throw error;

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
