
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface TeamStatsProps {
  team: any;
}

const TeamStats = ({ team }: TeamStatsProps) => {
  const constructorStats = [
    { label: "Championship Titles", value: team.championship_titles || 0, max: 10 },
    { label: "Race Wins", value: 15, max: 50 },
    { label: "Podium Finishes", value: 32, max: 100 },
    { label: "Pole Positions", value: 8, max: 40 },
    { label: "Fastest Laps", value: 12, max: 30 },
  ];

  const seasonPerformance = [
    { label: "Constructor Points", value: team.points || 0, change: "+25", trend: "up" },
    { label: "Championship Position", value: team.position || 0, change: "±0", trend: "stable" },
    { label: "Avg. Points Per Race", value: "18.5", change: "+3.2", trend: "up" },
    { label: "Reliability Score", value: "94%", change: "+2%", trend: "up" },
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "down": return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Constructor Statistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {constructorStats.map((stat, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{stat.label}</span>
                <span className="font-medium">{stat.value}</span>
              </div>
              <Progress 
                value={(stat.value / stat.max) * 100} 
                className="h-2"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>2025 Season Performance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {seasonPerformance.map((stat, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <div className="font-medium">{stat.label}</div>
                <div className="text-2xl font-bold">{stat.value}</div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {getTrendIcon(stat.trend)}
                <span className={
                  stat.trend === "up" ? "text-green-500" : 
                  stat.trend === "down" ? "text-red-500" : "text-gray-500"
                }>
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamStats;
