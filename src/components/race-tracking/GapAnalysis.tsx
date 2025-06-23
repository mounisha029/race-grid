
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  BarChart3,
  Target
} from "lucide-react";

interface GapAnalysisProps {
  liveData: any;
  currentLap: number;
}

const GapAnalysis = ({ liveData, currentLap }: GapAnalysisProps) => {
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  const drivers = liveData?.data || [];

  // Mock historical gap data - in real implementation, this would come from the API
  const gapHistory = drivers.map((driver: any, index: number) => ({
    driverId: driver.id,
    name: `${driver.drivers?.first_name} ${driver.drivers?.last_name}`,
    position: driver.current_position,
    gaps: Array.from({ length: Math.min(currentLap, 20) }, (_, lapIndex) => ({
      lap: currentLap - 19 + lapIndex,
      gapToLeader: Math.random() * 60 + index * 5,
      gapToAhead: index === 0 ? 0 : Math.random() * 5 + 1
    }))
  }));

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds.toFixed(3)}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toFixed(3)}`;
  };

  const getGapTrend = (gaps: any[]) => {
    if (gaps.length < 2) return 'stable';
    const recent = gaps.slice(-3).map(g => g.gapToLeader);
    const trend = recent[recent.length - 1] - recent[0];
    if (trend > 1) return 'losing';
    if (trend < -1) return 'gaining';
    return 'stable';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'gaining': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'losing': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <Activity className="w-4 h-4 text-yellow-500" />;
    }
  };

  const calculateBattles = () => {
    const battles = [];
    for (let i = 0; i < drivers.length - 1; i++) {
      const driver1 = drivers[i];
      const driver2 = drivers[i + 1];
      const gap = parseFloat(driver2.gap_to_ahead?.replace('+', '') || '0');
      
      if (gap < 3) { // Battle within 3 seconds
        battles.push({
          position: driver1.current_position,
          driver1: `${driver1.drivers?.first_name} ${driver1.drivers?.last_name}`,
          driver2: `${driver2.drivers?.first_name} ${driver2.drivers?.last_name}`,
          gap: gap,
          intensity: gap < 1 ? 'high' : gap < 2 ? 'medium' : 'low'
        });
      }
    }
    return battles;
  };

  const battles = calculateBattles();

  return (
    <div className="space-y-6">
      <Tabs defaultValue="gaps" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="gaps">Gap Analysis</TabsTrigger>
          <TabsTrigger value="battles">Battle Tracker</TabsTrigger>
          <TabsTrigger value="trends">Performance Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="gaps" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gap to Leader */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Gap to Leader
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {drivers.slice(1, 11).map((driver: any) => {
                    const gapSeconds = parseFloat(driver.gap_to_leader?.replace('+', '') || '0');
                    const maxGap = 60; // Normalize to 60 seconds max
                    
                    return (
                      <div key={driver.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="w-8 text-center">
                              P{driver.current_position}
                            </Badge>
                            <span className="font-medium text-sm">
                              {driver.drivers?.first_name?.charAt(0)}. {driver.drivers?.last_name}
                            </span>
                          </div>
                          <span className="font-mono text-sm">
                            +{formatTime(gapSeconds)}
                          </span>
                        </div>
                        <Progress 
                          value={(gapSeconds / maxGap) * 100} 
                          className="h-2"
                        />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Gap Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Gap Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {gapHistory.slice(0, 10).map((driver) => {
                    const trend = getGapTrend(driver.gaps);
                    
                    return (
                      <div
                        key={driver.driverId}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedDriver === driver.driverId ? 'bg-muted border-primary' : 'hover:bg-muted/50'
                        }`}
                        onClick={() => setSelectedDriver(
                          selectedDriver === driver.driverId ? null : driver.driverId
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="w-8 text-center">
                              P{driver.position}
                            </Badge>
                            <span className="font-medium text-sm">{driver.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {getTrendIcon(trend)}
                            <span className="text-sm capitalize">{trend}</span>
                          </div>
                        </div>
                        
                        {selectedDriver === driver.driverId && (
                          <div className="mt-3 pt-3 border-t">
                            <div className="text-xs text-muted-foreground mb-2">
                              Recent lap times (last 5 laps)
                            </div>
                            <div className="grid grid-cols-5 gap-1">
                              {driver.gaps.slice(-5).map((gap, index) => (
                                <div key={index} className="text-xs text-center p-1 bg-muted rounded">
                                  {formatTime(gap.gapToLeader)}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="battles" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Current Battles
              </CardTitle>
            </CardHeader>
            <CardContent>
              {battles.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No close battles detected (within 3 seconds)
                </div>
              ) : (
                <div className="space-y-4">
                  {battles.map((battle, index) => (
                    <div key={index} className="p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Badge 
                            className={
                              battle.intensity === 'high' ? 'bg-red-500 text-white' :
                              battle.intensity === 'medium' ? 'bg-orange-500 text-white' :
                              'bg-yellow-500 text-black'
                            }
                          >
                            {battle.intensity.toUpperCase()} INTENSITY
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            Positions {battle.position}-{battle.position + 1}
                          </span>
                        </div>
                        <div className="font-bold text-lg">
                          {formatTime(battle.gap)}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <Badge variant="outline" className="mb-2">
                            P{battle.position}
                          </Badge>
                          <div className="font-medium">{battle.driver1}</div>
                        </div>
                        <div className="text-center">
                          <Badge variant="outline" className="mb-2">
                            P{battle.position + 1}
                          </Badge>
                          <div className="font-medium">{battle.driver2}</div>
                        </div>
                      </div>
                      
                      <Progress 
                        value={((3 - battle.gap) / 3) * 100} 
                        className="mt-3 h-2"
                      />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Performance Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="text-sm text-muted-foreground mb-1">Fastest Lap</div>
                  <div className="font-bold text-lg">1:23.456</div>
                  <div className="text-xs text-muted-foreground">Hamilton (Lap 15)</div>
                </div>
                
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="text-sm text-muted-foreground mb-1">Average Gap</div>
                  <div className="font-bold text-lg">12.3s</div>
                  <div className="text-xs text-muted-foreground">To leader</div>
                </div>
                
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="text-sm text-muted-foreground mb-1">Close Battles</div>
                  <div className="font-bold text-lg">{battles.length}</div>
                  <div className="text-xs text-muted-foreground">Within 3 seconds</div>
                </div>
              </div>
              
              <div className="mt-6 space-y-4">
                <h4 className="font-medium">Lap Time Evolution</h4>
                <div className="text-sm text-muted-foreground">
                  Track showing gradual improvement as track rubber builds up.
                  Average lap time decreased by 0.8s since race start.
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg border">
                    <div className="text-sm font-medium mb-2">Tire Degradation</div>
                    <div className="text-xs text-muted-foreground">
                      Soft compounds showing 0.3s degradation per 10 laps
                    </div>
                    <Progress value={65} className="mt-2 h-2" />
                  </div>
                  
                  <div className="p-3 rounded-lg border">
                    <div className="text-sm font-medium mb-2">Track Evolution</div>
                    <div className="text-xs text-muted-foreground">
                      Optimal racing line forming, grip increasing
                    </div>
                    <Progress value={78} className="mt-2 h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GapAnalysis;
