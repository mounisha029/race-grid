
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ScatterChart, Scatter, XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Target, TrendingUp, Award } from "lucide-react";

interface QualifyingRaceData {
  driver: string;
  qualifyingPosition: number;
  racePosition: number;
  qualifyingTime: number;
  raceTime: number;
  points: number;
}

interface QualifyingVsRaceAnalyticsProps {
  data: QualifyingRaceData[];
}

const QualifyingVsRaceAnalytics = ({ data }: QualifyingVsRaceAnalyticsProps) => {
  // Calculate performance metrics
  const performanceData = data.map(item => ({
    ...item,
    positionChange: item.qualifyingPosition - item.racePosition,
    qualifyingPerformance: item.qualifyingPosition <= 10 ? 'Top 10' : 'Outside Top 10',
    racePerformance: item.racePosition <= 10 ? 'Points' : 'No Points'
  }));

  const averagePositionChange = performanceData.reduce((sum, item) => sum + item.positionChange, 0) / performanceData.length;
  
  const bestQualifier = performanceData.reduce((best, current) => 
    current.qualifyingPosition < best.qualifyingPosition ? current : best
  );

  const bestRaceFinisher = performanceData.reduce((best, current) => 
    current.racePosition < best.racePosition ? current : best
  );

  const biggestGainer = performanceData.reduce((best, current) => 
    current.positionChange > best.positionChange ? current : best
  );

  const chartConfig = {
    qualifyingPosition: {
      label: "Qualifying Position",
      color: "hsl(var(--chart-1))",
    },
    racePosition: {
      label: "Race Position",
      color: "hsl(var(--chart-2))",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          Qualifying vs Race Performance
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 rounded-lg border">
            <Award className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
            <div className="font-semibold">{bestQualifier.driver}</div>
            <div className="text-sm text-muted-foreground">Best Qualifier (P{bestQualifier.qualifyingPosition})</div>
          </div>

          <div className="text-center p-4 rounded-lg border">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <div className="font-semibold">{biggestGainer.driver}</div>
            <div className="text-sm text-muted-foreground">
              Biggest Gainer (+{biggestGainer.positionChange})
            </div>
          </div>

          <div className="text-center p-4 rounded-lg border">
            <Target className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <div className="font-semibold">{bestRaceFinisher.driver}</div>
            <div className="text-sm text-muted-foreground">Race Winner (P{bestRaceFinisher.racePosition})</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Position Changes</h3>
            <ChartContainer config={chartConfig} className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData.slice(0, 10)}>
                  <XAxis dataKey="driver" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="positionChange" fill="var(--color-qualifyingPosition)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Qualifying vs Race Positions</h3>
            <ChartContainer config={chartConfig} className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart data={performanceData}>
                  <XAxis dataKey="qualifyingPosition" domain={[1, 20]} />
                  <YAxis dataKey="racePosition" domain={[1, 20]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Scatter dataKey="racePosition" fill="var(--color-racePosition)" />
                </ScatterChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Performance Summary</h3>
          <div className="space-y-2">
            {performanceData.map((driver, index) => (
              <div key={driver.driver} className="flex items-center justify-between p-3 rounded border">
                <div className="flex items-center gap-3">
                  <span className="font-medium">{driver.driver}</span>
                  <Badge variant={driver.positionChange > 0 ? "default" : driver.positionChange < 0 ? "destructive" : "secondary"}>
                    {driver.positionChange > 0 ? '+' : ''}{driver.positionChange}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span>Qual: P{driver.qualifyingPosition}</span>
                  <span>Race: P{driver.racePosition}</span>
                  <span className="font-medium">{driver.points} pts</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QualifyingVsRaceAnalytics;
