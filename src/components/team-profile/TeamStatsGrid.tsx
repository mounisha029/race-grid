
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target, Zap, Clock, TrendingUp, Award } from "lucide-react";

interface TeamStatsGridProps {
  team: any;
}

const TeamStatsGrid = ({ team }: TeamStatsGridProps) => {
  const stats = [
    {
      title: "Constructor Points",
      value: team.points || 0,
      icon: Trophy,
      color: "text-f1-orange",
      change: "+45 last 5 races"
    },
    {
      title: "Championship Position",
      value: team.position || 'N/A',
      icon: Target,
      color: "text-f1-red",
      change: "Unchanged"
    },
    {
      title: "Race Wins (2024)",
      value: 3,
      icon: Trophy,
      color: "text-f1-yellow",
      change: "+1 last race"
    },
    {
      title: "Podium Finishes",
      value: 12,
      icon: Award,
      color: "text-green-500",
      change: "+2 last 3 races"
    },
    {
      title: "Pole Positions",
      value: 4,
      icon: Zap,
      color: "text-blue-500",
      change: "+1 this month"
    },
    {
      title: "Fastest Laps",
      value: 6,
      icon: Clock,
      color: "text-purple-500",
      change: "+1 last race"
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
                value={typeof stat.value === 'number' ? Math.min((stat.value / 20) * 100, 100) : 0} 
                className="mt-2" 
              />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default TeamStatsGrid;
