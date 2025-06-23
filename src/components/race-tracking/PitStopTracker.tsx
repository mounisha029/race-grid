
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Activity, Clock } from "lucide-react";

interface PitStopTrackerProps {
  liveData: any;
  raceId: string;
}

const PitStopTracker = ({ liveData, raceId }: PitStopTrackerProps) => {
  const drivers = liveData?.data || [];
  
  // Mock pit stop data - in real implementation, this would come from the API
  const pitStops = [
    { driverId: '1', lap: 15, duration: '2.8s', tyreChange: 'Medium → Soft', position: 3 },
    { driverId: '2', lap: 18, duration: '3.1s', tyreChange: 'Hard → Medium', position: 7 },
    { driverId: '3', lap: 22, duration: '2.6s', tyreChange: 'Soft → Hard', position: 2 },
  ];

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

  const getTyreAgeColor = (age: number) => {
    if (age <= 5) return 'text-green-600';
    if (age <= 15) return 'text-yellow-600';
    if (age <= 25) return 'text-orange-600';
    return 'text-red-600';
  };

  const driversInPit = drivers.filter((driver: any) => driver.in_pit);

  return (
    <div className="space-y-6">
      {/* Current Pit Activity */}
      {driversInPit.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-600">
              <Activity className="w-5 h-5" />
              Drivers in Pit Lane
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {driversInPit.map((driver: any) => (
                <div key={driver.id} className="flex items-center justify-between p-3 rounded-lg border border-orange-200 bg-orange-50">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-orange-500 text-white">PIT</Badge>
                    <div>
                      <div className="font-medium">
                        {driver.drivers?.first_name} {driver.drivers?.last_name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        P{driver.current_position} → Pit Lane
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <div 
                        className={`w-4 h-4 rounded-full ${getTyreColor(driver.tyre_compound)}`}
                        title={driver.tyre_compound}
                      />
                      <span className="text-sm">Changing tyres...</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tire Strategies */}
        <Card>
          <CardHeader>
            <CardTitle>Current Tire Strategies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {drivers.map((driver: any) => (
                <div key={driver.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-sm w-8">P{driver.current_position}</span>
                    <div>
                      <div className="font-medium text-sm">
                        {driver.drivers?.first_name?.charAt(0)}. {driver.drivers?.last_name}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div 
                        className={`w-4 h-4 rounded-full ${getTyreColor(driver.tyre_compound)}`}
                        title={driver.tyre_compound}
                      />
                      <span className="text-sm capitalize">{driver.tyre_compound}</span>
                    </div>
                    
                    <div className="text-right">
                      <div className={`text-sm font-medium ${getTyreAgeColor(driver.tyre_age || 0)}`}>
                        {driver.tyre_age || 0} laps
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Pit Stops */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Pit Stops
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pitStops.map((stop, index) => (
                <div key={index} className="p-3 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">Driver #{stop.driverId}</div>
                    <Badge variant="outline">Lap {stop.lap}</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="ml-2 font-medium">{stop.duration}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Position:</span>
                      <span className="ml-2">P{stop.position}</span>
                    </div>
                  </div>
                  
                  <div className="mt-2 text-sm">
                    <span className="text-muted-foreground">Tyre Change:</span>
                    <span className="ml-2">{stop.tyreChange}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pit Window Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Pit Window Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="text-sm text-muted-foreground mb-1">Optimal Window</div>
                <div className="font-bold text-lg">Lap 18-25</div>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="text-sm text-muted-foreground mb-1">Pit Loss</div>
                <div className="font-bold text-lg">~22 seconds</div>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="text-sm text-muted-foreground mb-1">Stops Completed</div>
                <div className="font-bold text-lg">{pitStops.length}/20</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Pit Stop Progress</span>
                <span>{Math.round((pitStops.length / 20) * 100)}%</span>
              </div>
              <Progress value={(pitStops.length / 20) * 100} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PitStopTracker;
