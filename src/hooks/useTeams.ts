
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Team {
  id: string;
  name: string;
  full_name: string;
  primary_color: string;
  secondary_color: string;
  logo_url?: string;
  points?: number;
  position?: number;
  championship_titles?: number;
}

export const useTeams = () => {
  return useQuery({
    queryKey: ['teams'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      return data as Team[];
    }
  });
};
