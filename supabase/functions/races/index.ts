
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
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

    const { method } = req;
    const url = new URL(req.url);

    switch (method) {
      case "GET": {
        const season = url.searchParams.get("season") || "2024";
        const status = url.searchParams.get("status");

        let query = supabaseClient
          .from("races")
          .select(`
            *,
            circuits (
              name,
              location,
              country,
              track_length_km,
              number_of_turns
            ),
            session_results (
              *,
              drivers (
                first_name,
                last_name,
                driver_number
              ),
              teams (
                name,
                primary_color
              )
            )
          `)
          .eq("season", parseInt(season))
          .order("round");

        if (status) {
          query = query.eq("status", status);
        }

        const { data: races, error } = await query;

        if (error) throw error;

        return new Response(JSON.stringify({ races }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      case "POST": {
        const raceData = await req.json();
        
        const { data: race, error } = await supabaseClient
          .from("races")
          .insert(raceData)
          .select()
          .single();

        if (error) throw error;

        return new Response(JSON.stringify({ race }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 201,
        });
      }

      case "PUT": {
        const raceId = url.searchParams.get("id");
        const updates = await req.json();

        if (!raceId) {
          throw new Error("Race ID is required");
        }

        const { data: race, error } = await supabaseClient
          .from("races")
          .update(updates)
          .eq("id", raceId)
          .select()
          .single();

        if (error) throw error;

        return new Response(JSON.stringify({ race }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      default:
        return new Response("Method not allowed", {
          headers: corsHeaders,
          status: 405,
        });
    }
  } catch (error) {
    console.error("Error in races function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
