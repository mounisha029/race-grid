
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface SyncRequest {
  type: 'races' | 'drivers' | 'constructors' | 'results';
  season?: number;
  round?: number;
  force?: boolean;
}

interface SyncResult {
  success: boolean;
  message?: string;
  error?: string;
  timestamp: string;
}

export const useDataSync = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastSync, setLastSync] = useState<SyncResult | null>(null);

  const syncData = async (request: SyncRequest): Promise<SyncResult> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('data-sync', {
        body: request
      });

      if (error) throw error;

      const result: SyncResult = data;
      setLastSync(result);
      return result;
    } catch (error) {
      const errorResult: SyncResult = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date().toISOString()
      };
      setLastSync(errorResult);
      return errorResult;
    } finally {
      setIsLoading(false);
    }
  };

  const syncCurrentSeason = async () => {
    const currentSeason = new Date().getFullYear();
    
    console.log('Starting full season sync...');
    
    // Sync races first
    await syncData({ type: 'races', season: currentSeason });
    
    // Then sync standings
    await syncData({ type: 'drivers', season: currentSeason });
    await syncData({ type: 'constructors', season: currentSeason });
    
    console.log('Full season sync completed');
  };

  const syncRaceResults = async (season: number, round: number) => {
    return await syncData({ type: 'results', season, round });
  };

  const forceSyncAll = async (season?: number) => {
    const targetSeason = season || new Date().getFullYear();
    
    await syncData({ type: 'races', season: targetSeason, force: true });
    await syncData({ type: 'drivers', season: targetSeason, force: true });
    await syncData({ type: 'constructors', season: targetSeason, force: true });
  };

  return {
    syncData,
    syncCurrentSeason,
    syncRaceResults,
    forceSyncAll,
    isLoading,
    lastSync
  };
};
