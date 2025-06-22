
import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface LiveTimingData {
  raceId: string;
  sessionType: string;
  data: Array<{
    id: string;
    current_position: number;
    last_lap_time: string | null;
    sector_1_time: string | null;
    sector_2_time: string | null;
    sector_3_time: string | null;
    speed_trap_kmh: number | null;
    tyre_compound: string | null;
    tyre_age: number | null;
    gap_to_leader: string | null;
    gap_to_ahead: string | null;
    drs_enabled: boolean;
    in_pit: boolean;
    drivers: {
      first_name: string;
      last_name: string;
      driver_number: number;
    };
  }>;
  mockUpdates?: any[];
  timestamp: string;
}

export const useLiveTiming = (raceId: string, sessionType?: string) => {
  const [liveData, setLiveData] = useState<LiveTimingData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const fetchLiveData = useCallback(async () => {
    if (!raceId) return;

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ race_id: raceId });
      if (sessionType) {
        params.append('session_type', sessionType);
      }

      const { data, error: functionError } = await supabase.functions.invoke('live-timing', {
        method: 'GET',
        body: null,
      });

      if (functionError) throw functionError;

      setLiveData(data);
      setIsConnected(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch live timing data';
      setError(errorMessage);
      console.error('Live timing fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [raceId, sessionType]);

  const updateLiveData = async (timingData: any) => {
    try {
      const { data, error: functionError } = await supabase.functions.invoke('live-timing', {
        method: 'POST',
        body: {
          raceId,
          sessionType: sessionType || 'race',
          drivers: timingData,
          timestamp: new Date().toISOString()
        }
      });

      if (functionError) throw functionError;

      // Refresh live data after update
      await fetchLiveData();
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update live timing data';
      setError(errorMessage);
      throw err;
    }
  };

  // Set up real-time subscription for live session data
  useEffect(() => {
    if (!raceId) return;

    const channel = supabase
      .channel('live-session-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'live_session_data',
          filter: `race_id=eq.${raceId}`
        },
        (payload) => {
          console.log('Live timing update received:', payload);
          // Refresh data when changes occur
          fetchLiveData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [raceId, fetchLiveData]);

  // Initial data fetch
  useEffect(() => {
    fetchLiveData();
  }, [fetchLiveData]);

  // Simulate live updates for demo purposes
  useEffect(() => {
    if (!liveData?.mockUpdates || !isConnected) return;

    const interval = setInterval(() => {
      // Simulate receiving new timing data
      const randomUpdate = liveData.mockUpdates![Math.floor(Math.random() * liveData.mockUpdates!.length)];
      console.log('Simulated timing update:', randomUpdate);
      
      // In a real implementation, this would be triggered by actual timing data
      // For now, we just refresh the data periodically
      fetchLiveData();
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [liveData?.mockUpdates, isConnected, fetchLiveData]);

  return {
    liveData,
    isLoading,
    error,
    isConnected,
    fetchLiveData,
    updateLiveData,
    refetch: fetchLiveData
  };
};
