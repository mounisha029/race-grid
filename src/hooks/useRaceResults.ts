
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface RaceResult {
  id: string;
  race_id: string;
  driver_id: string;
  position: number;
  points_awarded: number;
  final_time?: string;
  status: 'finished' | 'dnf' | 'dns' | 'dsq';
  drivers: {
    first_name: string;
    last_name: string;
    driver_number: number;
  };
  teams: {
    name: string;
    primary_color: string;
  };
}

export const useRaceResults = (raceId?: string) => {
  return useQuery({
    queryKey: ['race-results', raceId],
    queryFn: async () => {
      if (!raceId) return [];
      
      const { data, error } = await supabase
        .from('session_results')
        .select(`
          id,
          race_id,
          driver_id,
          position,
          points_awarded,
          final_time,
          status,
          drivers (
            first_name,
            last_name,
            driver_number
          ),
          teams (
            name,
            primary_color
          )
        `)
        .eq('race_id', raceId)
        .eq('session_type', 'race')
        .order('position', { ascending: true });

      if (error) throw error;
      return data as RaceResult[];
    },
    enabled: !!raceId
  });
};
