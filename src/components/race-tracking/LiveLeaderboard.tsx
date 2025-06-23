
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  Activity,
  Timer,
  Flag
} from "lucide-react";

interface LiveLeaderboardProps {
  liveData: any;
  raceStatus: string;
  currentLap: number;
}

const LiveLeaderboard = ({ liveData, raceStatus, currentLap }: LiveLeaderboardProps) => {
  const drivers = liveData?.data || [];

  const getPositionChange = (currentPos: number, startPos: number) => {
    const change = startPos - currentPos;
    if (change > 0) return { type: 'up', value: change };
    if (change < 0) return { type: 'down', value: Math.abs(change) };
    return { type: 'same', value: 0 };
  };

  const getTyreColor = (compound: string) => {
    switch (compound?.toLowerCase()) {
      case 'soft': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-gray-500';
      case 'intermediate': return 'bg-green-500';
      case 'wet': return 'bg-blue-500';
      default: return 'bg-gray-400';
    }
  };

  const formatTime = (timeStr: string) => {
    if (!timeStr) return '--:--:---';
    return timeStr;
  };

  const formatGap = (gap: string) => {
    if (!gap || gap === 'null') return '--';
    return gap;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Flag className="w-5 h-5" />
            Live Leaderboard
          </span>
          <Badge variant="outline" className="text-xs">
            Lap {currentLap}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {drivers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No live timing data available
            </div>
          ) : (
            drivers.map((driver: any, index: number) => {
              const positionChange = getPositionChange(driver.current_position, index + 5); // Mock start position
              
              return (
                <div
                  key={driver.id}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  {/* Position */}
                  <div className="flex items-center gap-2 w-16">
                    <span className="font-bold text-lg min-w-[2ch]">
                      {driver.current_position}
                    </span>
                    {positionChange.type !== 'same' && (
                      <div className="flex items-center">
                        {positionChange.type === 'up' ? (
                          <TrendingUp className="w-3 h-3 text-green-500" />
                        ) : (
                          <TrendingDown className="w-3 h-3 text-red-500" />
                        )}
                        <span className="text-xs">{positionChange.value}</span>
                      </div>
                    )}
                  </div>

                  {/* Driver Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {driver.drivers?.first_name} {driver.drivers?.last_name}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        #{driver.drivers?.driver_number}
                      </Badge>
                    </div>
                  </div>

                  {/* Tire Info */}
                  <div className="flex items-center gap-2">
                    <div 
                      className={`w-4 h-4 rounded-full ${getTyreColor(driver.tyre_compound)}`}
                      title={`${driver.tyre_compound} (${driver.tyre_age} laps)`}
                    />
                    <span className="text-xs w-6">{driver.tyre_age}</span>
                  </div>

                  {/* Last Lap Time */}
                  <div className="text-right min-w-[80px]">
                    <div className="font-mono text-sm">
                      {formatTime(driver.last_lap_time)}
                    </div>
                  </div>

                  {/* Gap */}
                  <div className="text-right min-w-[60px]">
                    <div className="text-sm">
                      {driver.current_position === 1 ? 'Leader' : formatGap(driver.gap_to_leader)}
                    </div>
                  </div>

                  {/* Status Indicators */}
                  <div className="flex items-center gap-1">
                    {driver.in_pit && (
                      <Badge className="bg-orange-500 text-white text-xs">PIT</Badge>
                    )}
                    {driver.drs_enabled && (
                      <Badge className="bg-blue-500 text-white text-xs">DRS</Badge>
                    )}
                    {driver.speed_trap_kmh && (
                      <div className="text-xs text-muted-foreground">
                        {driver.speed_trap_kmh} km/h
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Race Status Banner */}
        {raceStatus !== 'race' && (
          <div className="mt-4 p-3 rounded-lg bg-yellow-100 border border-yellow-300">
            <div className="flex items-center gap-2 text-yellow-800">
              <Activity className="w-4 h-4" />
              <span className="font-medium">
                {raceStatus === 'safety_car' && 'Safety Car Deployed'}
                {raceStatus === 'virtual_safety_car' && 'Virtual Safety Car Active'}
                {raceStatus === 'red_flag' && 'Red Flag - Race Suspended'}
                {raceStatus === 'formation' && 'Formation Lap in Progress'}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LiveLeaderboard;
