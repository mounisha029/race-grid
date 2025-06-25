
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_BASE_URL = "https://wcgrdwsndxjkpfgcnbhx.supabase.co/functions/v1";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjZ3Jkd3NuZHhqa3BmZ2NuYmh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2MDU3NDEsImV4cCI6MjA2NjE4MTc0MX0.EDNbLn1UdVAx85xv6Lh0TKGTgZX4vnzp4a-zt9qS3XM";

// Generic API hook for GET requests
export const useApiQuery = <T>(
  endpoint: string,
  queryKey: string[],
  params?: Record<string, string>
) => {
  return useQuery({
    queryKey,
    queryFn: async (): Promise<T> => {
      const url = new URL(`${API_BASE_URL}/${endpoint}`);
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          url.searchParams.append(key, value);
        });
      }

      const response = await fetch(url.toString(), {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'apikey': SUPABASE_ANON_KEY,
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      return response.json();
    },
  });
};

// Mutation hook for POST/PUT/DELETE requests
export const useApiMutation = (
  endpoint: string,
  method: 'POST' | 'PUT' | 'DELETE' = 'POST'
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const url = `${API_BASE_URL}/${endpoint}`;
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'apikey': SUPABASE_ANON_KEY,
        },
        body: method !== 'DELETE' ? JSON.stringify(data) : undefined,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch queries after successful mutation
      queryClient.invalidateQueries();
    },
  });
};

// Specific hooks for F1 data with dynamic year
export const useDrivers = () => {
  return useApiQuery("drivers", ["drivers"]);
};

export const useTeams = () => {
  return useApiQuery("teams", ["teams"]);
};

export const useRaceCalendar = (season?: string, status?: string) => {
  const currentYear = new Date().getFullYear();
  const targetSeason = season || currentYear.toString();
  
  const params: Record<string, string> = {};
  params.season = targetSeason;
  if (status) params.status = status;
  
  return useApiQuery("races", ["races", targetSeason, status || "all"], params);
};

export const useLiveRaceData = (raceId: string) => {
  return useApiQuery(
    `live-race?race_id=${raceId}`,
    ["live-race", raceId],
    undefined
  );
};

export const useChampionshipStandings = (season?: string, type?: string) => {
  const currentYear = new Date().getFullYear();
  const targetSeason = season || currentYear.toString();
  
  const params: Record<string, string> = {};
  params.season = targetSeason;
  if (type) params.type = type;
  
  return useApiQuery("championship", ["championship", targetSeason, type || "drivers"], params);
};
