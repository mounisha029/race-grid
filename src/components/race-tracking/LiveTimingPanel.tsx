
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Timer, Activity, Gauge } from "lucide-react";

interface LiveTimingPanelProps {
  liveData: any;
  raceId: string;
}

const LiveTimingPanel = ({ liveData, raceId }: LiveTimingPanelProps) => {
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  const drivers = liveData?.data || [];

  const formatSectorTime = (time: string) => {
    if (!time || time === 'null') return '--:--';
    return time;
  };

  const getSectorColor = (time: string, isPersonalBest: boolean, isOverallBest: boolean) => {
    if (isOverallBest) return 'text-purple-600 font-bold';
    if (isPersonalBest) return 'text-green-600 font-medium';
    return 'text-foreground';
  };

  const getSpeedColor = (speed: number) => {
    if (speed > 320) return 'text-purple-600 font-bold';
    if (speed > 300) return 'text-green-600 font-medium';
    if (speed > 280) return 'text-yellow-600';
    return 'text-foreground';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Sector Times */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="w-5 h-5" />
            Sector Times
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {drivers.map((driver: any) => (
              <div
                key={driver.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedDriver === driver.id ? 'bg-muted border-primary' : 'hover:bg-muted/50'
                }`}
                onClick={() => setSelectedDriver(selectedDriver === driver.id ? null : driver.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {driver.drivers?.first_name} {driver.drivers?.last_name}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      P{driver.current_position}
                    </Badge>
                  </div>
                  <div className="font-mono text-sm">
                    {formatSectorTime(driver.last_lap_time)}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground mb-1">S1</div>
                    <div className={getSectorColor(driver.sector_1_time, false, false)}>
                      {formatSectorTime(driver.sector_1_time)}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground mb-1">S2</div>
                    <div className={getSectorColor(driver.sector_2_time, false, false)}>
                      {formatSectorTime(driver.sector_2_time)}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground mb-1">S3</div>
                    <div className={getSectorColor(driver.sector_3_time, false, false)}>
                      {formatSectorTime(driver.sector_3_time)}
                    </div>
                  </div>
                </div>

                {selectedDriver === driver.id && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Speed Trap:</span>
                        <span className={`ml-2 ${getSpeedColor(driver.speed_trap_kmh || 0)}`}>
                          {driver.speed_trap_kmh || '--'} km/h
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Gap to Leader:</span>
                        <span className="ml-2">
                          {driver.gap_to_leader || '--'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Speed Trap */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gauge className="w-5 h-5" />
            Speed Trap
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {drivers
              .filter((driver: any) => driver.speed_trap_kmh)
              .sort((a: any, b: any) => (b.speed_trap_kmh || 0) - (a.speed_trap_kmh || 0))
              .slice(0, 10)
              .map((driver: any, index: number) => (
                <div key={driver.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Badge variant={index === 0 ? "default" : "outline"} className="w-8 text-center">
                      {index + 1}
                    </Badge>
                    <div>
                      <div className="font-medium">
                        {driver.drivers?.first_name} {driver.drivers?.last_name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        P{driver.current_position}
                      </div>
                    </div>
                  </div>
                  <div className={`font-bold text-lg ${getSpeedColor(driver.speed_trap_kmh)}`}>
                    {driver.speed_trap_kmh} km/h
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveTimingPanel;
