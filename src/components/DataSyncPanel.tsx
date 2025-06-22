
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useDataSync } from "@/hooks/useDataSync";
import { f1DataService } from "@/services/f1DataService";
import { Loader2, RefreshCw, Database, Calendar, Trophy, Users, CheckCircle, AlertCircle } from "lucide-react";

const DataSyncPanel = () => {
  const { syncData, syncCurrentSeason, forceSyncAll, isLoading, lastSync } = useDataSync();
  const [selectedSeason, setSelectedSeason] = useState<string>(new Date().getFullYear().toString());
  const [selectedRound, setSelectedRound] = useState<string>('1');

  const currentYear = new Date().getFullYear();
  const seasons = Array.from({ length: 10 }, (_, i) => currentYear - i);

  const handleSyncRaces = async () => {
    await syncData({ type: 'races', season: parseInt(selectedSeason) });
  };

  const handleSyncDrivers = async () => {
    await syncData({ type: 'drivers', season: parseInt(selectedSeason) });
  };

  const handleSyncConstructors = async () => {
    await syncData({ type: 'constructors', season: parseInt(selectedSeason) });
  };

  const handleSyncResults = async () => {
    await syncData({ 
      type: 'results', 
      season: parseInt(selectedSeason), 
      round: parseInt(selectedRound) 
    });
  };

  const handleFullSync = async () => {
    await syncCurrentSeason();
  };

  const handleForceSync = async () => {
    await forceSyncAll(parseInt(selectedSeason));
  };

  const handleClearCache = () => {
    f1DataService.clearCache();
  };

  const cacheStats = f1DataService.getCacheStats();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="w-5 h-5" />
            <span>F1 Data Synchronization</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Season Selection */}
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Season</label>
              <Select value={selectedSeason} onValueChange={setSelectedSeason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select season" />
                </SelectTrigger>
                <SelectContent>
                  {seasons.map(season => (
                    <SelectItem key={season} value={season.toString()}>
                      {season}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Round (for results)</label>
              <Select value={selectedRound} onValueChange={setSelectedRound}>
                <SelectTrigger>
                  <SelectValue placeholder="Select round" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }, (_, i) => i + 1).map(round => (
                    <SelectItem key={round} value={round.toString()}>
                      Round {round}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Individual Sync Options */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={handleSyncRaces}
              disabled={isLoading}
              variant="outline"
              className="flex items-center space-x-2"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calendar className="w-4 h-4" />}
              <span>Sync Races</span>
            </Button>

            <Button
              onClick={handleSyncDrivers}
              disabled={isLoading}
              variant="outline"
              className="flex items-center space-x-2"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Users className="w-4 h-4" />}
              <span>Sync Drivers</span>
            </Button>

            <Button
              onClick={handleSyncConstructors}
              disabled={isLoading}
              variant="outline"
              className="flex items-center space-x-2"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trophy className="w-4 h-4" />}
              <span>Sync Constructors</span>
            </Button>

            <Button
              onClick={handleSyncResults}
              disabled={isLoading}
              variant="outline"
              className="flex items-center space-x-2"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              <span>Sync Results</span>
            </Button>
          </div>

          <Separator />

          {/* Bulk Operations */}
          <div className="flex space-x-4">
            <Button
              onClick={handleFullSync}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center space-x-2"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              <span>Full Current Season Sync</span>
            </Button>

            <Button
              onClick={handleForceSync}
              disabled={isLoading}
              variant="destructive"
              className="flex items-center space-x-2"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <AlertCircle className="w-4 h-4" />}
              <span>Force Sync</span>
            </Button>
          </div>

          <Separator />

          {/* Cache Management */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Cache Status</p>
              <p className="text-xs text-muted-foreground">
                {cacheStats.size} cached entries
              </p>
            </div>
            <Button onClick={handleClearCache} variant="outline" size="sm">
              Clear Cache
            </Button>
          </div>

          {/* Last Sync Status */}
          {lastSync && (
            <div className="p-3 rounded-lg bg-muted">
              <div className="flex items-center space-x-2 mb-2">
                {lastSync.success ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-500" />
                )}
                <span className="text-sm font-medium">
                  Last Sync: {lastSync.success ? 'Success' : 'Failed'}
                </span>
                <Badge variant={lastSync.success ? 'default' : 'destructive'}>
                  {new Date(lastSync.timestamp).toLocaleTimeString()}
                </Badge>
              </div>
              {lastSync.message && (
                <p className="text-xs text-muted-foreground">{lastSync.message}</p>
              )}
              {lastSync.error && (
                <p className="text-xs text-red-600">{lastSync.error}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DataSyncPanel;
