
import { useQuery } from '@tanstack/react-query';
import { ergastApiService, ErgastRace, ErgastDriver, ErgastConstructor, ErgastStandings } from '@/services/ergastApiService';

// Hook for fetching current season races
export const useCurrentSeasonRaces = () => {
  return useQuery({
    queryKey: ['ergast', 'current-season-races'],
    queryFn: () => ergastApiService.getCurrentSeasonRaces(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Hook for fetching races by season
export const useSeasonRaces = (season: number) => {
  return useQuery({
    queryKey: ['ergast', 'season-races', season],
    queryFn: () => ergastApiService.getSeasonRaces(season),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: !!season,
  });
};

// Hook for fetching race results
export const useRaceResults = (season: number, round: number) => {
  return useQuery({
    queryKey: ['ergast', 'race-results', season, round],
    queryFn: () => ergastApiService.getRaceResults(season, round),
    staleTime: 30 * 60 * 1000, // 30 minutes (race results don't change often)
    gcTime: 60 * 60 * 1000, // 1 hour
    enabled: !!season && !!round,
  });
};

// Hook for fetching current driver standings
export const useCurrentDriverStandings = () => {
  return useQuery({
    queryKey: ['ergast', 'current-driver-standings'],
    queryFn: () => ergastApiService.getCurrentDriverStandings(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
};

// Hook for fetching driver standings by season
export const useDriverStandings = (season: number) => {
  return useQuery({
    queryKey: ['ergast', 'driver-standings', season],
    queryFn: () => ergastApiService.getDriverStandings(season),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: !!season,
  });
};

// Hook for fetching current constructor standings
export const useCurrentConstructorStandings = () => {
  return useQuery({
    queryKey: ['ergast', 'current-constructor-standings'],
    queryFn: () => ergastApiService.getCurrentConstructorStandings(),
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
};

// Hook for fetching constructor standings by season
export const useConstructorStandings = (season: number) => {
  return useQuery({
    queryKey: ['ergast', 'constructor-standings', season],
    queryFn: () => ergastApiService.getConstructorStandings(season),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: !!season,
  });
};

// Hook for fetching drivers by season
export const useSeasonDrivers = (season: number) => {
  return useQuery({
    queryKey: ['ergast', 'season-drivers', season],
    queryFn: () => ergastApiService.getSeasonDrivers(season),
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    enabled: !!season,
  });
};

// Hook for fetching constructors by season
export const useSeasonConstructors = (season: number) => {
  return useQuery({
    queryKey: ['ergast', 'season-constructors', season],
    queryFn: () => ergastApiService.getSeasonConstructors(season),
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    enabled: !!season,
  });
};

// Hook for fetching qualifying results
export const useQualifyingResults = (season: number, round: number) => {
  return useQuery({
    queryKey: ['ergast', 'qualifying-results', season, round],
    queryFn: () => ergastApiService.getQualifyingResults(season, round),
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    enabled: !!season && !!round,
  });
};

// Hook for fetching lap times
export const useLapTimes = (season: number, round: number, lap?: number) => {
  return useQuery({
    queryKey: ['ergast', 'lap-times', season, round, lap],
    queryFn: () => ergastApiService.getLapTimes(season, round, lap),
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    enabled: !!season && !!round,
  });
};

// Hook for fetching pit stops
export const usePitStops = (season: number, round: number) => {
  return useQuery({
    queryKey: ['ergast', 'pit-stops', season, round],
    queryFn: () => ergastApiService.getPitStops(season, round),
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    enabled: !!season && !!round,
  });
};
