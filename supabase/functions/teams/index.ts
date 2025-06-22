
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

    switch (method) {
      case "GET": {
        const { data: teams, error } = await supabaseClient
          .from("teams")
          .select(`
            *,
            drivers (
              id,
              first_name,
              last_name,
              driver_number,
              points
            )
          `)
          .eq("is_active", true)
          .order("position", { nullsFirst: false });

        if (error) throw error;

        return new Response(JSON.stringify({ teams }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      case "POST": {
        const teamData = await req.json();
        
        const { data: team, error } = await supabaseClient
          .from("teams")
          .insert(teamData)
          .select()
          .single();

        if (error) throw error;

        return new Response(JSON.stringify({ team }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 201,
        });
      }

      case "PUT": {
        const url = new URL(req.url);
        const teamId = url.searchParams.get("id");
        const updates = await req.json();

        if (!teamId) {
          throw new Error("Team ID is required");
        }

        const { data: team, error } = await supabaseClient
          .from("teams")
          .update(updates)
          .eq("id", teamId)
          .select()
          .single();

        if (error) throw error;

        return new Response(JSON.stringify({ team }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      case "DELETE": {
        const url = new URL(req.url);
        const teamId = url.searchParams.get("id");

        if (!teamId) {
          throw new Error("Team ID is required");
        }

        const { error } = await supabaseClient
          .from("teams")
          .update({ is_active: false })
          .eq("id", teamId);

        if (error) throw error;

        return new Response(JSON.stringify({ success: true }), {
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
    console.error("Error in teams function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
