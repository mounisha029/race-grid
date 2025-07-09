
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Driver {
  id: string;
  first_name: string;
  last_name: string;
  driver_number: number;
  team_id: string;
  nationality: string;
  profile_image_url?: string;
}

export const useDrivers = () => {
  return useQuery({
    queryKey: ['drivers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('drivers')
        .select('*')
        .eq('is_active', true)
        .order('last_name');

      if (error) throw error;
      return data as Driver[];
    }
  });
};
