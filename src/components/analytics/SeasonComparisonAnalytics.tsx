
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from "recharts";
import { useState } from "react";
import { Calendar, TrendingUp, Trophy } from "lucide-react";

interface SeasonData {
  race: number;
  season: number;
  points: number;
  position: number;
  driver: string;
  team: string;
}

interface SeasonComparisonAnalyticsProps {
  data: SeasonData[];
  availableSeasons: number[];
}

const SeasonComparisonAnalytics = ({ data, availableSeasons }: SeasonComparisonAnalyticsProps) => {
  const [selectedSeasons, setSelectedSeasons] = useState<number[]>([2024, 2025]);
  const [selectedDriver, setSelectedDriver] = useState<string>("all");

  const drivers = [...new Set(data.map(item => item.driver))];
  
  const filteredData = data.filter(item => {
    if (!selectedSeasons.includes(item.season)) return false;
    if (selectedDriver !== "all" && item.driver !== selectedDriver) return false;
    return true;
  });

  // Calculate cumulative points by race
  const cumulativeData = selectedSeasons.map(season => {
    const seasonData = filteredData.filter(item => item.season === season);
    let cumulative = 0;
    return seasonData.map(item => {
      cumulative += item.points;
      return {
        ...item,
        cumulativePoints: cumulative,
        seasonLabel: `${season}`
      };
    });
  }).flat();

  // Season comparison metrics
  const seasonMetrics = selectedSeasons.map(season => {
    const seasonData = filteredData.filter(item => item.season === season);
    const totalPoints = seasonData.reduce((sum, item) => sum + item.points, 0);
    const wins = seasonData.filter(item => item.position === 1).length;
    const podiums = seasonData.filter(item => item.position <= 3).length;
    const averagePosition = seasonData.reduce((sum, item) => sum + item.position, 0) / seasonData.length;

    return {
      season,
      totalPoints,
      wins,
      podiums,
      averagePosition: averagePosition || 0,
      races: seasonData.length
    };
  });

  const chartConfig = {
    cumulativePoints: {
      label: "Cumulative Points",
      color: "hsl(var(--chart-1))",
    },
    totalPoints: {
      label: "Total Points",
      color: "hsl(var(--chart-2))",
    },
  };

  const colors = ['#ef4444', '#3b82f6', '#22c55e', '#eab308'];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Season Comparison Analytics
        </CardTitle>
        <div className="flex gap-4">
          <Select value={selectedDriver} onValueChange={setSelectedDriver}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select driver" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Drivers</SelectItem>
              {drivers.map(driver => (
                <SelectItem key={driver} value={driver}>{driver}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {seasonMetrics.map((season, index) => (
            <div key={season.season} className="p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5" style={{ color: colors[index] }} />
                <span className="font-semibold">{season.season} Season</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Points:</span>
                  <span className="font-bold">{season.totalPoints}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Wins:</span>
                  <span className="font-bold">{season.wins}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Podiums:</span>
                  <span className="font-bold">{season.podiums}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Avg Pos:</span>
                  <span className="font-bold">{season.averagePosition.toFixed(1)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Cumulative Points Progression</h3>
            <ChartContainer config={chartConfig} className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cumulativeData}>
                  <XAxis dataKey="race" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  {selectedSeasons.map((season, index) => (
                    <Line
                      key={season}
                      type="monotone"
                      dataKey="cumulativePoints"
                      data={cumulativeData.filter(item => item.season === season)}
                      stroke={colors[index]}
                      strokeWidth={3}
                      dot={{ r: 4 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Season Comparison</h3>
            <ChartContainer config={chartConfig} className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={seasonMetrics}>
                  <XAxis dataKey="season" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="totalPoints" fill="var(--color-totalPoints)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Performance Comparison</h3>
          <div className="space-y-3">
            {seasonMetrics.map((season, index) => (
              <div key={season.season} className="flex items-center justify-between p-4 rounded border">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded" 
                    style={{ backgroundColor: colors[index] }}
                  />
                  <span className="font-semibold">{season.season} Season</span>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-1">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    <span>{season.wins} wins</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span>{season.podiums} podiums</span>
                  </div>
                  <div className="font-medium">{season.totalPoints} points</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SeasonComparisonAnalytics;
