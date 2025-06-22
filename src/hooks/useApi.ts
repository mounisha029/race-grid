
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_BASE_URL = "https://wcgrdwsndxjkpfgcnbhx.supabase.co/functions/v1";

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

// Specific hooks for F1 data
export const useDrivers = () => {
  return useApiQuery("drivers", ["drivers"]);
};

export const useTeams = () => {
  return useApiQuery("teams", ["teams"]);
};

export const useRaceCalendar = (season?: string, status?: string) => {
  const params: Record<string, string> = {};
  if (season) params.season = season;
  if (status) params.status = status;
  
  return useApiQuery("races", ["races", season || "2024", status || "all"], params);
};

export const useLiveRaceData = (raceId: string) => {
  return useApiQuery(
    `live-race?race_id=${raceId}`,
    ["live-race", raceId],
    undefined
  );
};

export const useChampionshipStandings = (season?: string, type?: string) => {
  const params: Record<string, string> = {};
  if (season) params.season = season;
  if (type) params.type = type;
  
  return useApiQuery("championship", ["championship", season || "2024", type || "drivers"], params);
};
