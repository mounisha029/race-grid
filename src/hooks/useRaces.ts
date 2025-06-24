
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

export const useRaces = (season?: number) => {
  const currentYear = new Date().getFullYear();
  const targetSeason = season || currentYear;

  return useQuery({
    queryKey: ['races', targetSeason],
    queryFn: async () => {
      console.log(`Fetching races for season: ${targetSeason}`);
      
      // Try to fetch data for the target season
      let { data, error } = await supabase
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
        .eq('season', targetSeason)
        .order('round');

      // If no data found for target season and it's 2025, try fallback to 2024
      if ((!data || data.length === 0) && targetSeason === 2025) {
        console.log('No 2025 data found, falling back to 2024');
        const fallbackQuery = await supabase
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
          .eq('season', 2024)
          .order('round');
        
        data = fallbackQuery.data;
        error = fallbackQuery.error;
      }

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
