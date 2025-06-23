
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Trophy, Zap, Target, Clock } from "lucide-react";

interface DriverStatsGridProps {
  driver: any;
}

const DriverStatsGrid = ({ driver }: DriverStatsGridProps) => {
  const stats = [
    {
      title: "Race Wins",
      value: driver.wins || 0,
      icon: Trophy,
      color: "text-f1-yellow",
      change: "+2 this season"
    },
    {
      title: "Podium Finishes",
      value: driver.podiums || 0,
      icon: Target,
      color: "text-green-500",
      change: "+5 this season"
    },
    {
      title: "Pole Positions",
      value: driver.pole_positions || 0,
      icon: Zap,
      color: "text-blue-500",
      change: "+1 this season"
    },
    {
      title: "Fastest Laps",
      value: driver.fastest_laps || 0,
      icon: Clock,
      color: "text-purple-500",
      change: "+3 this season"
    },
    {
      title: "DNFs",
      value: driver.dnfs || 0,
      icon: TrendingDown,
      color: "text-red-500",
      change: "2 this season"
    },
    {
      title: "Championships",
      value: driver.championships || 0,
      icon: Trophy,
      color: "text-f1-orange",
      change: "Career total"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
              <Progress 
                value={Math.min((stat.value / 10) * 100, 100)} 
                className="mt-2" 
              />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DriverStatsGrid;
