
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface DriverStatsProps {
  driver: any;
}

const DriverStats = ({ driver }: DriverStatsProps) => {
  const careerStats = [
    { label: "Career Wins", value: driver.wins || 0, max: 20 },
    { label: "Podium Finishes", value: driver.podiums || 0, max: 50 },
    { label: "Pole Positions", value: driver.pole_positions || 0, max: 30 },
    { label: "Fastest Laps", value: driver.fastest_laps || 0, max: 25 },
    { label: "DNFs", value: driver.dnfs || 0, max: 10, isNegative: true },
  ];

  const seasonStats = [
    { label: "Current Points", value: driver.points || 0, change: "+15", trend: "up" },
    { label: "Championship Position", value: driver.position || 0, change: "±0", trend: "stable" },
    { label: "Avg. Qualifying Position", value: "8.5", change: "-0.5", trend: "up" },
    { label: "Points Per Race", value: "12.3", change: "+2.1", trend: "up" },
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
          <CardTitle>Career Statistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {careerStats.map((stat, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{stat.label}</span>
                <span className="font-medium">{stat.value}</span>
              </div>
              <Progress 
                value={(stat.value / stat.max) * 100} 
                className={`h-2 ${stat.isNegative ? 'bg-red-100' : ''}`}
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
          {seasonStats.map((stat, index) => (
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

export default DriverStats;
