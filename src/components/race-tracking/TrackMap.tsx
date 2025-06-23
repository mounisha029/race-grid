
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Map, Flag, Activity } from "lucide-react";

interface TrackMapProps {
  liveData: any;
  raceId: string;
}

const TrackMap = ({ liveData, raceId }: TrackMapProps) => {
  const drivers = liveData?.data || [];

  // Mock track data - in real implementation, this would be specific to each circuit
  const trackInfo = {
    name: "Circuit Name",
    length: 5.412,
    turns: 19,
    drsZones: [
      { name: "Main Straight", start: 0, end: 15, detection: 10 },
      { name: "Back Straight", start: 60, end: 75, detection: 55 }
    ],
    sectors: [
      { number: 1, length: 35, characteristics: "Technical corners" },
      { number: 2, length: 30, characteristics: "High-speed section" },
      { number: 3, length: 35, characteristics: "Tight corners & main straight" }
    ]
  };

  // Mock car positions as percentages around the track
  const carPositions = drivers.map((driver: any, index: number) => ({
    ...driver,
    trackPosition: (index * 5 + Math.random() * 10) % 100, // Mock position
    sector: Math.floor((index * 5 + Math.random() * 10) / 33.33) + 1,
    inDrsZone: Math.random() > 0.8
  }));

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

  return (
    <div className="space-y-6">
      {/* Track Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Map className="w-5 h-5" />
            {trackInfo.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-3 rounded-lg bg-muted/50">
              <div className="text-sm text-muted-foreground mb-1">Track Length</div>
              <div className="font-bold text-lg">{trackInfo.length} km</div>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <div className="text-sm text-muted-foreground mb-1">Total Turns</div>
              <div className="font-bold text-lg">{trackInfo.turns}</div>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <div className="text-sm text-muted-foreground mb-1">DRS Zones</div>
              <div className="font-bold text-lg">{trackInfo.drsZones.length}</div>
            </div>
          </div>

          {/* Simple Track Visualization */}
          <div className="relative">
            <div className="w-full h-64 bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/20 relative overflow-hidden">
              {/* Track representation */}
              <div className="absolute inset-4">
                <div className="w-full h-full border-4 border-gray-400 rounded-full relative">
                  {/* DRS Zones */}
                  {trackInfo.drsZones.map((zone, index) => (
                    <div
                      key={index}
                      className="absolute bg-blue-200/50 border border-blue-400"
                      style={{
                        left: `${zone.start}%`,
                        width: `${zone.end - zone.start}%`,
                        height: '8px',
                        top: '-4px'
                      }}
                      title={`DRS Zone: ${zone.name}`}
                    />
                  ))}

                  {/* Car positions */}
                  {carPositions.slice(0, 10).map((driver: any, index: number) => {
                    const angle = (driver.trackPosition / 100) * 360;
                    const radius = 45; // Percentage of container
                    const x = 50 + radius * Math.cos((angle - 90) * Math.PI / 180);
                    const y = 50 + radius * Math.sin((angle - 90) * Math.PI / 180);

                    return (
                      <div
                        key={driver.id}
                        className="absolute w-3 h-3 transform -translate-x-1/2 -translate-y-1/2"
                        style={{ left: `${x}%`, top: `${y}%` }}
                        title={`P${driver.current_position}: ${driver.drivers?.first_name} ${driver.drivers?.last_name}`}
                      >
                        <div className={`w-3 h-3 rounded-full border-2 border-white ${getTyreColor(driver.tyre_compound)}`}>
                          <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              {driver.current_position}
                            </span>
                          </div>
                        </div>
                        {driver.inDrsZone && (
                          <Badge className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs">
                            DRS
                          </Badge>
                        )}
                      </div>
                    );
                  })}

                  {/* Start/Finish Line */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <Flag className="w-6 h-6 text-black" />
                  </div>
                </div>
              </div>
              
              {/* Legend */}
              <div className="absolute bottom-2 left-2 text-xs text-muted-foreground">
                <div>● Position on track</div>
                <div>🏁 Start/Finish</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sector Information */}
        <Card>
          <CardHeader>
            <CardTitle>Sector Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trackInfo.sectors.map((sector) => (
                <div key={sector.number} className="p-3 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">Sector {sector.number}</Badge>
                    <span className="text-sm font-medium">{sector.length}% of lap</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {sector.characteristics}
                  </div>
                  <Progress value={sector.length} className="mt-2 h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* DRS Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              DRS Zones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trackInfo.drsZones.map((zone, index) => (
                <div key={index} className="p-3 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">{zone.name}</div>
                    <Badge className="bg-blue-500 text-white">DRS</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Detection:</span>
                      <span className="ml-2">{zone.detection}%</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Length:</span>
                      <span className="ml-2">{zone.end - zone.start}%</span>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Current DRS Status */}
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                <div className="text-sm font-medium text-blue-800 mb-2">
                  Drivers Currently in DRS Zone
                </div>
                <div className="space-y-1">
                  {carPositions
                    .filter((driver: any) => driver.inDrsZone)
                    .map((driver: any) => (
                      <div key={driver.id} className="text-sm text-blue-700">
                        P{driver.current_position}: {driver.drivers?.first_name} {driver.drivers?.last_name}
                      </div>
                    ))}
                  {carPositions.filter((driver: any) => driver.inDrsZone).length === 0 && (
                    <div className="text-sm text-blue-600">No drivers currently in DRS zone</div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TrackMap;
