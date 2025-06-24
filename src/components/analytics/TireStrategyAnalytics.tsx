
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { Circle, TrendingDown, Timer, Zap } from "lucide-react";

interface TireData {
  driver: string;
  stint: number;
  compound: 'soft' | 'medium' | 'hard' | 'intermediate' | 'wet';
  stintLength: number;
  averageLapTime: number;
  degradation: number;
  pitStopLap: number;
}

interface TireStrategyAnalyticsProps {
  data: TireData[];
}

const TireStrategyAnalytics = ({ data }: TireStrategyAnalyticsProps) => {
  const tireColors = {
    soft: '#ef4444',
    medium: '#eab308', 
    hard: '#64748b',
    intermediate: '#22c55e',
    wet: '#3b82f6'
  };

  // Calculate tire compound performance
  const compoundPerformance = Object.entries(
    data.reduce((groups, item) => {
      if (!groups[item.compound]) groups[item.compound] = [];
      groups[item.compound].push(item);
      return groups;
    }, {} as Record<string, TireData[]>)
  ).map(([compound, items]) => ({
    compound,
    averageLapTime: items.reduce((sum, item) => sum + item.averageLapTime, 0) / items.length,
    averageStintLength: items.reduce((sum, item) => sum + item.stintLength, 0) / items.length,
    averageDegradation: items.reduce((sum, item) => sum + item.degradation, 0) / items.length,
    usage: items.length,
    color: tireColors[compound as keyof typeof tireColors]
  }));

  // Pit stop strategy analysis
  const pitStopData = data.reduce((groups, item) => {
    const key = `Lap ${item.pitStopLap}`;
    if (!groups[key]) groups[key] = 0;
    groups[key]++;
    return groups;
  }, {} as Record<string, number>);

  const pitStopChartData = Object.entries(pitStopData).map(([lap, count]) => ({
    lap: parseInt(lap.replace('Lap ', '')),
    count
  })).sort((a, b) => a.lap - b.lap);

  const getTireIcon = (compound: string) => {
    return <Circle className="w-4 h-4" style={{ color: tireColors[compound as keyof typeof tireColors] }} />;
  };

  const chartConfig = {
    averageLapTime: {
      label: "Average Lap Time",
      color: "hsl(var(--chart-1))",
    },
    degradation: {
      label: "Degradation",
      color: "hsl(var(--chart-2))",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Circle className="w-5 h-5" />
          Tire Strategy Analytics
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {compoundPerformance.map((compound) => (
            <div key={compound.compound} className="p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                {getTireIcon(compound.compound)}
                <span className="font-semibold capitalize">{compound.compound}</span>
              </div>
              <div className="space-y-1">
                <div className="text-lg font-bold">{compound.averageLapTime.toFixed(3)}s</div>
                <div className="text-xs text-muted-foreground">
                  {compound.averageStintLength.toFixed(1)} laps avg
                </div>
                <div className="text-xs text-muted-foreground">
                  {compound.averageDegradation.toFixed(2)}s degradation
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Compound Performance</h3>
            <ChartContainer config={chartConfig} className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={compoundPerformance}>
                  <XAxis dataKey="compound" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="averageLapTime" fill="var(--color-averageLapTime)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Pit Stop Windows</h3>
            <ChartContainer config={chartConfig} className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pitStopChartData}>
                  <XAxis dataKey="lap" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="var(--color-degradation)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Tire Strategy Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-red-500" />
                <span className="font-semibold">Fastest Compound</span>
              </div>
              <div className="text-lg font-bold">Soft</div>
              <div className="text-sm text-muted-foreground">
                {compoundPerformance.find(c => c.compound === 'soft')?.averageLapTime.toFixed(3)}s avg
              </div>
            </div>

            <div className="p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <Timer className="w-5 h-5 text-yellow-500" />
                <span className="font-semibold">Longest Stint</span>
              </div>
              <div className="text-lg font-bold">Hard</div>
              <div className="text-sm text-muted-foreground">
                {compoundPerformance.find(c => c.compound === 'hard')?.averageStintLength.toFixed(1)} laps
              </div>
            </div>

            <div className="p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-5 h-5 text-green-500" />
                <span className="font-semibold">Best Degradation</span>
              </div>
              <div className="text-lg font-bold">Hard</div>
              <div className="text-sm text-muted-foreground">
                {compoundPerformance.find(c => c.compound === 'hard')?.averageDegradation.toFixed(2)}s/lap
              </div>
            </div>

            <div className="p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <Circle className="w-5 h-5 text-blue-500" />
                <span className="font-semibold">Most Used</span>
              </div>
              <div className="text-lg font-bold">Medium</div>
              <div className="text-sm text-muted-foreground">
                {compoundPerformance.find(c => c.compound === 'medium')?.usage} stints
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TireStrategyAnalytics;
