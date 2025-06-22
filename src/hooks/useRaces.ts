
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Race {
  id: string;
  name: string;
  location: string;
  country: string;
  date: string;
  time: string;
  round: number;
  status: "scheduled" | "practice" | "qualifying" | "race" | "completed" | "cancelled";
  circuit: string;
  season: number;
  weather_condition?: string;
  is_sprint_weekend: boolean;
}

export const useRaces = (season: number = 2024) => {
  return useQuery({
    queryKey: ['races', season],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('races')
        .select(`
          id,
          season,
          round,
          name,
          race_date,
          race_time,
          status,
          weather_condition,
          is_sprint_weekend,
          circuits (
            name,
            location,
            country
          )
        `)
        .eq('season', season)
        .order('round');

      if (error) throw error;

      return data?.map(race => ({
        id: race.id,
        name: race.name,
        location: race.circuits?.location || '',
        country: race.circuits?.country || '',
        date: race.race_date,
        time: race.race_time || '',
        round: race.round,
        status: race.status as Race['status'],
        circuit: race.circuits?.name || '',
        season: race.season,
        weather_condition: race.weather_condition,
        is_sprint_weekend: race.is_sprint_weekend
      })) || [];
    }
  });
};
