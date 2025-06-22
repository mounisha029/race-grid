
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

interface Database {
  public: {
    Tables: {
      drivers: any;
      teams: any;
    };
  };
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient<Database>(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const { method } = req;

    switch (method) {
      case "GET": {
        const { data: drivers, error } = await supabaseClient
          .from("drivers")
          .select(`
            *,
            teams (
              name,
              primary_color,
              secondary_color
            )
          `)
          .eq("is_active", true)
          .order("position", { nullsFirst: false });

        if (error) throw error;

        return new Response(JSON.stringify({ drivers }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      case "POST": {
        // Admin function - create new driver
        const driverData = await req.json();
        
        const { data: driver, error } = await supabaseClient
          .from("drivers")
          .insert(driverData)
          .select()
          .single();

        if (error) throw error;

        return new Response(JSON.stringify({ driver }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 201,
        });
      }

      case "PUT": {
        // Admin function - update driver
        const url = new URL(req.url);
        const driverId = url.searchParams.get("id");
        const updates = await req.json();

        if (!driverId) {
          throw new Error("Driver ID is required");
        }

        const { data: driver, error } = await supabaseClient
          .from("drivers")
          .update(updates)
          .eq("id", driverId)
          .select()
          .single();

        if (error) throw error;

        return new Response(JSON.stringify({ driver }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      case "DELETE": {
        // Admin function - deactivate driver
        const url = new URL(req.url);
        const driverId = url.searchParams.get("id");

        if (!driverId) {
          throw new Error("Driver ID is required");
        }

        const { error } = await supabaseClient
          .from("drivers")
          .update({ is_active: false })
          .eq("id", driverId);

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
    console.error("Error in drivers function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
