
import { useQuery } from '@tanstack/react-query';
import { rapidApiService, HypraceRace, HypraceDriver, HypraceTeam, HypraceResult } from '@/services/rapidApiService';

// Hook for fetching current season races
export const useCurrentSeasonRaces = () => {
  const currentYear = new Date().getFullYear();
  return useQuery({
    queryKey: ['hyprace', 'current-season-races'],
    queryFn: () => rapidApiService.getSeasonRaces(currentYear),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Hook for fetching races by season
export const useSeasonRaces = (season: number) => {
  return useQuery({
    queryKey: ['hyprace', 'season-races', season],
    queryFn: () => rapidApiService.getSeasonRaces(season),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: !!season,
  });
};

// Hook for fetching race results
export const useRaceResults = (season: number, round: number) => {
  return useQuery({
    queryKey: ['hyprace', 'race-results', season, round],
    queryFn: () => rapidApiService.getRaceResults(season, round),
    staleTime: 30 * 60 * 1000, // 30 minutes (race results don't change often)
    gcTime: 60 * 60 * 1000, // 1 hour
    enabled: !!season && !!round,
  });
};

// Hook for fetching current driver standings
export const useCurrentDriverStandings = () => {
  const currentYear = new Date().getFullYear();
  return useQuery({
    queryKey: ['hyprace', 'current-driver-standings'],
    queryFn: () => rapidApiService.getDriverStandings(currentYear),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
};

// Hook for fetching driver standings by season
export const useDriverStandings = (season: number) => {
  return useQuery({
    queryKey: ['hyprace', 'driver-standings', season],
    queryFn: () => rapidApiService.getDriverStandings(season),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: !!season,
  });
};

// Hook for fetching current constructor standings
export const useCurrentConstructorStandings = () => {
  const currentYear = new Date().getFullYear();
  return useQuery({
    queryKey: ['hyprace', 'current-constructor-standings'],
    queryFn: () => rapidApiService.getTeamStandings(currentYear),
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
};

// Hook for fetching constructor standings by season
export const useConstructorStandings = (season: number) => {
  return useQuery({
    queryKey: ['hyprace', 'constructor-standings', season],
    queryFn: () => rapidApiService.getTeamStandings(season),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: !!season,
  });
};

// Hook for fetching drivers by season
export const useSeasonDrivers = (season: number) => {
  return useQuery({
    queryKey: ['hyprace', 'season-drivers', season],
    queryFn: () => rapidApiService.getSeasonDrivers(season),
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    enabled: !!season,
  });
};

// Hook for fetching constructors by season
export const useSeasonConstructors = (season: number) => {
  return useQuery({
    queryKey: ['hyprace', 'season-constructors', season],
    queryFn: () => rapidApiService.getSeasonTeams(season),
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    enabled: !!season,
  });
};

// Hook for fetching qualifying results
export const useQualifyingResults = (season: number, round: number) => {
  return useQuery({
    queryKey: ['hyprace', 'qualifying-results', season, round],
    queryFn: () => rapidApiService.getQualifyingResults(season, round),
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    enabled: !!season && !!round,
  });
};

// Export types for use in components
export type { HypraceRace, HypraceDriver, HypraceTeam, HypraceResult };
