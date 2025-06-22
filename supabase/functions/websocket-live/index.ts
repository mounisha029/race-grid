
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  const { headers } = req;
  const upgradeHeader = headers.get("upgrade") || "";

  if (upgradeHeader.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket connection", { 
      status: 400,
      headers: corsHeaders 
    });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);
  
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  let raceId: string | null = null;
  let updateInterval: number | null = null;

  socket.onopen = () => {
    console.log("WebSocket connection established");
    socket.send(JSON.stringify({ 
      type: "connection", 
      status: "connected",
      message: "Connected to F1 live updates" 
    }));
  };

  socket.onmessage = async (event) => {
    try {
      const message = JSON.parse(event.data);
      
      if (message.type === "subscribe" && message.raceId) {
        raceId = message.raceId;
        
        // Start sending live updates every 2 seconds
        if (updateInterval) {
          clearInterval(updateInterval);
        }
        
        updateInterval = setInterval(async () => {
          if (raceId) {
            try {
              const { data: liveData, error } = await supabaseClient
                .from("live_session_data")
                .select(`
                  *,
                  drivers (
                    first_name,
                    last_name,
                    driver_number
                  )
                `)
                .eq("race_id", raceId)
                .order("current_position");

              if (!error && liveData) {
                socket.send(JSON.stringify({
                  type: "live_update",
                  raceId,
                  data: liveData,
                  timestamp: new Date().toISOString()
                }));
              }
            } catch (err) {
              console.error("Error fetching live data:", err);
            }
          }
        }, 2000);

        socket.send(JSON.stringify({ 
          type: "subscribed", 
          raceId,
          message: `Subscribed to live updates for race ${raceId}` 
        }));
      }
      
      if (message.type === "unsubscribe") {
        if (updateInterval) {
          clearInterval(updateInterval);
          updateInterval = null;
        }
        raceId = null;
        
        socket.send(JSON.stringify({ 
          type: "unsubscribed",
          message: "Unsubscribed from live updates" 
        }));
      }
    } catch (error) {
      console.error("Error processing WebSocket message:", error);
      socket.send(JSON.stringify({ 
        type: "error", 
        message: "Invalid message format" 
      }));
    }
  };

  socket.onclose = () => {
    if (updateInterval) {
      clearInterval(updateInterval);
    }
    console.log("WebSocket connection closed");
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
    if (updateInterval) {
      clearInterval(updateInterval);
    }
  };

  return response;
});
